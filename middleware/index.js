var  express = require('express');
var auth = require('./auth');
var router = express.Router();
var verifikasi = require('./verifikasi');

//daftarkan menu registrasi
router.post('/api/v1/register', auth.register);
//daftarkan menu Login
router.post('/api/v1/login', auth.login);

//alamat yang perlu otorisasi
router.get('/api/v1/rahasia', verifikasi(), auth.halamanrahasia);

router.get('/api/v1/readdatakey', verifikasi(), auth.read_mahasiswa_key);

router.post('/api/v1/insertdatakey', verifikasi(), auth.post_mahasiswa_key);

module.exports = router;