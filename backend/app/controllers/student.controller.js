const bcrypt = require('bcryptjs');
const { validateStudent, validateStudentLogin } = require('../models/student.model');
const Student = require('../models/student.model');
const { hashPassword } = require('../utils/imports');


/***
 *  Create a new user
 * @param req
 * @param res
 */
exports.createStudent = async (req, res) => {
  try {
    const { error } = validateStudent(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    // let count = await Admin.count();
    // if (count>=5) return res.status(400).send({ message: 'Admin is already created' });

    req.body.password = await hashPassword(req.body.password);

    const newUser = await Student.create(req.body);

    return res.status(201).send({ message: 'CREATED', data: newUser });
  } catch (e) {
    return res.status(500).send(e.toString().split('"').join(''));
  }
};

/***
 * Get the current student
 * @param req
 * @param res
 */
exports.getCurrentStudent = async (req, res) => {
  try {
    return res.status(200).send({ message: 'OK', data:req.user});
  } catch (e) {
    return res.status(500).send(e.toString().split('"').join(''));
  }
};

/**
 * Login student
 * @param req
 * @param res
 */
exports.studentLogin = async (req, res) => {
  try {
    const { error } = validateStudentLogin(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const student = await Student.findOne({ where: { email: req.body.email } });
    if (!student) return res.status(404).send({ message: 'Invalid credentials' });

    const validPassword = await bcrypt.compare(req.body.password, student.password);
    if (!validPassword) return res.status(404).send({ message: 'Invalid credentials' });

    const token = student.generateAuthToken();

    return res.status(200).send({ message: 'OK', token });
  } catch (e) {
    return res.status(500).send(e.toString().split('"').join(''));
  }
};

/***
 * Update a student
 * @param req
 * @param res
 */
exports.updateStudent = async (req, res) => {
  try {
    const { error } = validateStudent(req.body, true);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const { email, phone } = req.body;

    const duplicateStudent = await Student.findOne({
      where: {
        id: { [Op.not]: req.user.id },
        [Op.or]: [{ email }, { phone }],
      },
    });

    if (duplicateStudent) {
      const phoneFound = phone === duplicateStudent.phone;
      const emailFound = email === duplicateStudent.email;
      return res.status(400).send({
        message: `Student with the same ${phoneFound ? 'phone' : emailFound ? 'email' :'nationalId'} already exists`,
      });
    }

    const result = await Student.update(req.body, { where: { id: req.user.id }, returning: true });

    return res.status(200).send({ message: 'UPDATED', data: result[1][0] });
  } catch (e) {
    return res.status(500).send(e.toString().split('"').join(''));
  }
};

/***
 * Delete a student
 * @param req
 * @param res
 */
exports.deleteStudent = async (req, res) => {
  try {
    const result = await Student.destroy({ where: { id: req.user.id } });
    if (!result) return res.status(404).send({ message: 'User not found' });

    return res.send({ message: 'DELETED', data: result });
  } catch (e) {
    return res.status(500).send(e.toString().split('"').join(''));
  }
};
