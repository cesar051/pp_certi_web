const express = require('express');
const router = express.Router();
const authenticate = require('../auth/authenticate');
const isAdmin = require('../auth/isAdmin')

const { userLogin } = require('../controllers/userLogin')
const { userSignUp } = require('../controllers/userSignUp')
const { getUsers } = require('../controllers/getUsers')
const { refreshToken } = require('../controllers/refreshToken')
const { getBasicUserInfo } = require('../controllers/getBasicUserInfo');
const { signOut } = require('../controllers/signOut')
const { generatePasswordChange } = require('../controllers/generatePasswordChange')
const { changePassword } = require('../controllers/changePassword')
const { updateUserState } = require('../controllers/updateUserState')
const { getFilteredUsers } = require('../controllers/getFilteredUsers')
const { uploadDataIVA } = require('../controllers/uploadDataIVA')
const { getCertificateInfo } = require('../controllers/getCertificateInfo')
const { updateUserMail } = require('../controllers/updateUserMail')

router.get('/userLogin', userLogin);

router.post('/userSignUp', userSignUp);
router.post('/refreshToken', refreshToken);
router.post('/getBasicUserInfo', authenticate, getBasicUserInfo);
router.post('/generatePasswordChange', generatePasswordChange);
router.post('/changePassword', changePassword);
router.post('/getUsers', isAdmin, getUsers);
router.post('/updateUserState', isAdmin, updateUserState);
router.post('/updateUserMail', isAdmin, updateUserMail);
router.post('/getFilteredUsers', isAdmin, getFilteredUsers);
router.post('/uploadDataIVA', isAdmin, uploadDataIVA);
router.post('/getCertificateInfo', authenticate, getCertificateInfo);

router.delete('/signOut', signOut);

module.exports = router;