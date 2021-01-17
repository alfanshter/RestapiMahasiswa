var connection = require('../koneksi');
var mysql = require('mysql');
var md5 = require('MD5');
var response = require('../res');
var jwt = require('jsonwebtoken');
var config = require('../config/secret');
var ip = require('ip');
const { connect } = require('.');
const mongoose = require('mongoose');
//controller untuk register
exports.register = function(req,res){

var newId = new mongoose.mongo.ObjectId('56cb91bdc3464f14678934ca');
// or leave the id string blank to generate an id with a new hex identifier
var newId2 = new mongoose.mongo.ObjectId();

    var email = {
        email : req.body.email
    }

    var query = "SELECT email FROM ?? WHERE ??=?";
    var table = ["user","email", email.email];

    query = mysql.format(query, table);

    connection.query(query, function(error,rows){
        var token = jwt.sign({rows}, config.secret,{
            // expiresIn: 1440
        });

        var post = {
            uid : newId2,
            username : req.body.username,
            email : email.email,
            password : md5(req.body.password),
            role : req.body.role,
            tanggal_daftar : new Date(),
            akses_token : token
        }
    
    
        
        if(error){
            console.log("error");
        }else{
            if(rows.length == 0){
                
                var query = "INSERT INTO ?? SET ?";
                var table = ["user"];
                query = mysql.format(query, table);
                connection.query(query, post, function(error,rows){
                    if(error){
                        console.log(error);
                    }else{
                        res.json({
                            success : true,
                            message : 'Token JWT Tergenerate',
                            token   : token,
                            status : "2"
                        });
                    }
                });
            }else{
                 res.json({
                     success : false,
                     message : 'Email sudah terdaftar',
                     status : "1"
                 });
            }
        }
    })

}


//controller untuk login 
exports.login = function(req,res){
    var post = {
        password : req.body.password,
        email : req.body.email
    }

    var query = "SELECT * FROM ?? WHERE ??=? AND ??=?";
    var table = ["user","password",md5(post.password),"email",post.email];

    query = mysql.format(query,table);

    connection.query(query,function(error,rows){
        if(error){
            console.log(error);
        }else{
            if(rows.length == 1){
                uid = rows[0].uid;
                akses_token = rows[0].akses_token;


                var data = {
                    id_user : uid ,
                    akses_token : akses_token,
                    ip_address : ip.address()
                }

                var query = "INSERT INTO ?? SET ?";
                var table = ["aksestoken"];

                query = mysql.format(query, table);

                connection.query(query, data , function(error,rows){
                    if(error){
                        console.log(error);
                    }else{
                         res.json({
                             success : true,
                             message : 'Token JWT Tergenerate',
                             token   : akses_token,
                             currUser: data.id_user,
                             status : "1"
                         });
                    }
                });
            }else{
                res.json({"Error" : true, "Message" : "Email atau password salah"});
            }
        }
    });
}

exports.halamanrahasia = function(req,res){
    response.ok("Halaman ini hanya untuk user dengan roles = 2",res);
}

exports.read_mahasiswa_key = function(req,res){
    connection.query('SELECT * FROM mahasiswa',function(err,rows,fields){
        if(err){
            console.log(err);
        }else{
            response.ok(rows,res);
        }
    });
}

exports.post_mahasiswa_key = function(req,res){
    var  nim = req.body.nim;
    var  nama = req.body.nama;
    var  jurusan = req.body.jurusan;

    connection.query('INSERT INTO mahasiswa (nim,nama,jurusan) VALUES(?,?,?)', 
        [nim,nama,jurusan],
        function(error,rows,fields){
            if(error){
                console.log(error);
            }else{
                response.ok("Berhasil Insert data",res)
            }
        }
    )
}


