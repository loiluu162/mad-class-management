const { StatusCodes } = require('http-status-codes');
const { User, StudyTime, sequelize } = require('../../db');
const AppError = require('../../utils/appError');
const { ClassRepo, StudyTimeRepo } = require('./repo');
const { REGISTRATION_ACCEPTED } = require('../../constants');
const { QueryTypes } = require('sequelize');
const getAllClasses = async () => {
  return await ClassRepo.findAll(
    {},
    [
      {
        model: User,
        as: 'students',
        attributes: {
          exclude: ['password'],
        },
        through: {
          where: {
            status: REGISTRATION_ACCEPTED,
          },
          attributes: ['status'],
        },
      },
      { model: StudyTime, as: 'studyTimes' },
    ],
    {
      order: [['id', 'DESC']],
    }
  );
};

const getAllMyClasses = async (req) => {
  const { userId } = req;
  // const query = `select * from
  // (select c.* from classes c
  // ) as c1 left join
  // (select r.* from registrations r left join users u on r."userId" = u.id where r."userId" = $userId) as c2
  // on c1."id" = c2."classId" order by c1.id desc
  // `;
  // const query = `
  // SELECT "classes"."id", "classes"."name", "classes"."maxStudents", "classes"."startDate", "classes"."endDate", "classes"."createdBy", "classes"."modifiedBy", "classes"."createdAt", "classes"."updatedAt", "students"."id" AS "students.id", "students"."name" AS "students.name", "students"."email" AS "students.email", "students"."photoUrl" AS "students.photoUrl", "students"."blocked" AS "students.blocked", "students"."enabled" AS "students.enabled", "students"."provider" AS "students.provider", "students"."providerId" AS "students.providerId", "students"."createdAt" AS "students.createdAt", "students"."updatedAt" AS "students.updatedAt", "students->registrations"."userId" AS "students.registrations.userId", "students->registrations"."classId" AS "students.registrations.classId", "students->registrations"."status" AS "students.registrations.status", "studyTimes"."id" AS "studyTimes.id", "studyTimes"."dayInWeek" AS "studyTimes.dayInWeek", "studyTimes"."startTime" AS "studyTimes.startTime", "studyTimes"."endTime" AS "studyTimes.endTime", "studyTimes"."classId" AS "studyTimes.classId" FROM "classes" AS "classes" LEFT OUTER JOIN ( "registrations" AS "students->registrations" INNER JOIN "users" AS "students" ON "students"."id" = "students->registrations"."userId" AND "students->registrations"."status" = 'ACCEPT') ON "classes"."id" = "students->registrations"."classId" LEFT OUTER JOIN "studyTimes" AS "studyTimes" ON "classes"."id" = "studyTimes"."classId" ORDER BY "classes"."id" DESC
  // `;
  const query = `
  
  select c1.id as id, c1.name, c1."maxStudents", c1."startDate", c1."endDate", c2.status as "regStatus" ,
  json_agg(json_build_object('id', c1."studyTimeId", 'startTime', c1."startTime", 'endTime', c1."endTime", 'dayInWeek', c1."dayInWeek")) as "studyTimes"
  from 
  (select c.*, s.id as "studyTimeId", s."startTime", s."endTime", s."dayInWeek" from classes c left join "studyTimes" s on c.id = s."classId"
  ) as c1 left join 
  (select r.* from registrations r left join users u on r."userId" = u.id where r."userId" = $userId) as c2
  on c1."id" = c2."classId"
  group by id, c1.name, c1."maxStudents", c1."startDate", c1."endDate", c2.status
  order by id desc
  
  `;
  const classes = await sequelize.query(query, {
    bind: { userId: userId },
    type: QueryTypes.SELECT,
  });
  return classes;
};

const createNewClass = async (req) => {
  const { name, startDate, endDate, studyTimes = [] } = req.body;
  const { userId } = req;
  return await ClassRepo.create(
    {
      name,
      startDate,
      endDate,
      createdBy: userId,
      modifiedBy: userId,
      studyTimes,
    },
    {
      include: [{ model: StudyTime, as: 'studyTimes' }],
    }
  );
};

const getClass = async (req) => {
  const { id } = req.params;
  const classRes = await ClassRepo.findById(id, [
    {
      model: User,
      as: 'students',
      through: {
        where: {
          status: REGISTRATION_ACCEPTED,
        },
        attributes: [],
      },
    },
    { model: StudyTime, as: 'studyTimes' },
  ]);
  if (!classRes) throw new AppError('Class not found', StatusCodes.NOT_FOUND);
  return classRes;
};
const getClassWithStatus = async (req) => {
  const { id } = req.params;
  const { userId } = req;
  const query = `
  
  select c1.id as id, c1.name, c1."maxStudents", c1."startDate", c1."endDate", c2.status as "regStatus" ,
  json_agg(json_build_object('id', c1."studyTimeId", 'startTime', c1."startTime", 'endTime', c1."endTime", 'dayInWeek', c1."dayInWeek")) as "studyTimes"
  from 
  (select c.*, s.id as "studyTimeId", s."startTime", s."endTime", s."dayInWeek" from classes c left join "studyTimes" s on c.id = s."classId"
  ) as c1 left join 
  (select r.* from registrations r left join users u on r."userId" = u.id where r."userId" = $userId) as c2
  on c1."id" = c2."classId"
  group by id, c1.name, c1."maxStudents", c1."startDate", c1."endDate", c2.status
  having id=$id
  `;
  const classes = await sequelize.query(query, {
    bind: { userId, id },
    type: QueryTypes.SELECT,
  });
  return classes[0];
};

const updateClass = async (req) => {
  const { id } = req.params;
  const { userId } = req;
  const { name, startDate, endDate, maxStudents, studyTimes } = req.body;

  const t = await sequelize.transaction();
  try {
    await ClassRepo.update(
      { name, startDate, endDate, modifiedBy: userId, maxStudents },
      { id },
      { transaction: t }
    );

    // const classRes = await ClassRepo.findById(id);
    if (studyTimes && studyTimes.length) {
      for (let i = 0; i < studyTimes.length; i++) {
        studyTimes[i].classId = id;
      }
      await StudyTime.bulkCreate(studyTimes, {
        updateOnDuplicate: ['dayInWeek', 'startTime', 'endTime', 'classId'],
        transaction: t,
      });
    }

    await t.commit();
  } catch (err) {
    console.log(err);
    await t.rollback();
    throw Error('Some thing went wrong');
  }
};

const deleteClass = async (req) => {
  const { id } = req.params;
  const success = await ClassRepo.delete({ id });
  if (!success) {
    throw new AppError(
      'Class not found or delete process has error',
      StatusCodes.BAD_REQUEST
    );
  }
};
const deleteStudyTime = async (req) => {
  const { studyTimeId } = req.params;
  const success = await StudyTimeRepo.delete({ id: studyTimeId });
  if (!success) {
    throw new AppError(
      'Study time not found or delete process has error',
      StatusCodes.BAD_REQUEST
    );
  }
};

module.exports = {
  getAllClasses,
  createNewClass,
  getClass,
  updateClass,
  deleteClass,
  deleteStudyTime,
  getAllMyClasses,
  getClassWithStatus,
};
