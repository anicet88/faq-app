//db.js
   
const mysql = require('mysql');
  
   
   
const pool = mysql.createPool({
    connectionLimit: process.env.CONNECTION_LIMIT,    // the number of connections node.js will hold open to our database
    password: process.env.DB_PASS,
    user: process.env.DB_USER,
    database: process.env.MYSQL_DB,
    host: process.env.DB_HOST,
    //port: process.env.DB_PORT
   
});
   
//creer la table utilisatteur
pool.query('create table if not exists Utilisateur (' +
'idUser int not null auto_increment primary key,' +
'nom varchar(255) not null,'+
'email varchar(255) not null,'+
'telephone varchar(255) not null)' , function (err, result) {
    if (err) throw err;
    console.log("table utilisateur cree");
  }
);   
 
//creer table Faq
pool.query('create table if not exists Faq (' +
'idFaq int not null auto_increment primary key,' +
'question varchar(255) not null ,' +
'reponse varchar(255) not null)'    , function (err, result) {
    if (err) throw err;
    console.log("table faq crée");
  }
);
  
//creer table CategorieFaq +'foreign key (idCategorie) references  Categorie(idCategorie),'
/*pool.query('create table if not exists CategorieFaq (' +
'idCategorie int auto_increment primary key,' +
'nomCategorie varchar(255) ),'  , function (err, result) {
    if (err) throw err;
    console.log("table categorie faq crée");
  }
); */

//creer table userFaq
pool.query('create table if not exists UserFaq (' +
'idUser int not null,' +
'idFaq int not null,' +
'foreign key (idUser) references  Utilisateur(idUser),' +
'foreign key (idFaq) references  Faq(idFaq) )' , function (err, result) {
    if (err) throw err;
    console.log("table userFaq crée");
  }
);

//let db = {}; //create an empty object you will use later to write  and export your queries. 
let db = {}; //create an empty object you will use later to write  and export your queries. 
   
 
db.InsertUserFaq = (idUser, idFaq) =>{
    return new Promise((resolve, reject)=>{
        pool.query('INSERT INTO UserFaq (idUser, idFaq) VALUES (?, ?)', [idUser, idFaq], (error, result)=>{
            if(error){
                return reject(error);
            }
             
              return resolve(result.insertId);
        });
    });
};   

db.InsertFaq = (idFaq) =>{
    return new Promise((resolve, reject)=>{
        pool.query('INSERT INTO Faq (idFaq, question, reponse) VALUES (?, ?,?)', [idFaq], (error, result)=>{
            if(error){
                return reject(error);
            }
             
              return resolve(result.insertId);
        });
    });
};   

db.user_faq= (idUser)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT Utilisateur.idUser, Utilisateur.nom, Utilisateur.email  FROM Utilisateur JOIN userFaq ON userFaq.idUser = ? and userFaq.idUser = Utilisateur.idUser', [idUser], (error, users)=>{
            if(error){
                return reject(error);
            }
            return resolve(users);
   
        })
    })
}
 
db.faq_user= (idFaq)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT Faq.idFaq, Faq.reponse, Faq.question FROM Faq JOIN userFaq ON userFaq.idFaq = ? and userFaq.idFaq = Faq.idFaq ', [idFaq], (error, faqs)=>{
            if(error){
                return reject(error);
            }
            return resolve(faqs);
   
        })
    })
}

db.allFaqUser= ()=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT Utilisateur.idUser, Utilisateur.nom, Utilisateur.email, Faq.question as FaqQuestion,Faq.reponse as FaqReponse FROM Utilisateur INNER JOIN  userFaq  ON userFaq.idUser = Utilisateur.idUser  INNER JOIN Faq ON userFaq.idFaq = Faq.idFaq GROUP BY  Utilisateur.idUser, Faq.idFaq ORDER BY Faq.idFaq ', (error, FaqsUsers)=>{
            if(error){
                return reject(error);
            }
            return resolve(FaqsUsers);
   
        })
    })
}

module.exports = db