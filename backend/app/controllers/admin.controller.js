const bcrypt = require('bcryptjs');
const { validateAdmin, validateAdminLogin } = require('../models/admin.model');
const Admin = require('../models/admin.model');
const { hashPassword } = require('../utils/imports');


/***
 *  Create a new user
 * @param req
 * @param res
 */
exports.createAdmin = async (req, res) => {
  try {
    const { error } = validateAdmin(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    // let count = await Admin.count();
    // if (count>=5) return res.status(400).send({ message: 'Admin is already created' });

    req.body.password = await hashPassword(req.body.password);

    const newUser = await Admin.create(req.body);

    return res.status(201).send({ message: 'CREATED', data: newUser });
  } catch (e) {
    return res.status(500).send(e.toString().split('"').join(''));
  }
};

/***
 * Get the current user
 * @param req
 * @param res
 */
exports.getCurrentAdmin = async (req, res) => {
  try {
    return res.status(200).send({ message: 'OK', data:req.user});
  } catch (e) {
    return res.status(500).send(e.toString().split('"').join(''));
  }
};

/**
 * Login User
 * @param req
 * @param res
 */
exports.adminLogin = async (req, res) => {
  try {
    const { error } = validateAdminLogin(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const user = await Admin.findOne({ where: { email: req.body.email } });
    if (!user) return res.status(404).send({ message: 'Invalid credentials' });

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(404).send({ message: 'Invalid credentials' });

    const token = user.generateAuthToken();

    return res.status(200).send({ message: 'OK', token });
  } catch (e) {
    return res.status(500).send(e.toString().split('"').join(''));
  }
};

/***
 * Update a user
 * @param req
 * @param res
 */
exports.updateAdmin = async (req, res) => {
  try {
    const { error } = validateAdmin(req.body, true);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const { email, nationalId, phone } = req.body;

    const duplicateAdmin = await Admin.findOne({
      where: {
        id: { [Op.not]: req.user.id },
        [Op.or]: [{ email }, { nationalId }, { phone }],
      },
    });

    if (duplicateUser) {
      const phoneFound = phone === duplicateAdmin.phone;
      const emailFound = email === duplicateAdmin.email;
      return res.status(400).send({
        message: `Admin with the same ${phoneFound ? 'phone' : emailFound ? 'email' : 'nationalId'} already exists`,
      });
    }

    const result = await Admin.update(req.body, { where: { id: req.user.id }, returning: true });

    return res.status(200).send({ message: 'UPDATED', data: result[1][0] });
  } catch (e) {
    return res.status(500).send(e.toString().split('"').join(''));
  }
};

/***
 * Delete a user
 * @param req
 * @param res
 */
exports.deleteAdmin = async (req, res) => {
  try {
    const result = await Admin.destroy({ where: { id: req.user.id } });
    if (!result) return res.status(404).send({ message: 'User not found' });

    return res.send({ message: 'DELETED', data: result });
  } catch (e) {
    return res.status(500).send(e.toString().split('"').join(''));
  }
};
