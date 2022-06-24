 //apiRouter.js
  
 const express =require('express');
 const apiRouter = express.Router();
 const db = require('./db.js');
   
    
 apiRouter.post('/user-faq',  async (req, res, next)=>{
     try{
         const idUser = req.body.userFaq.idUser;
         const idFaq = req.body.userFaq.idFaq;
         console.log(idUser);
         console.log(idFaq);
           
               if (!idUser || !idFaq) {
                 return res.sendStatus(400);
              }
     
         const userFaq =  await db.InsertUserFaq(idUser, idFaq).then(() => res.json({ message: 'user-Faq cree.' }));    
     
     } catch(e){
         console.log(e);
         res.sendStatus(400);
     }
  });

  apiRouter.post('/add-faq',  async (req, res, next)=>{
    try{
        const idFaq = req.body.user_faq.idFaq;
        console.log(idFaq);
          
              if (!idFaq) {
                return res.sendStatus(400);
             }
    
        const user_faq =  await db.InsertFaq(idFaq).then(() => res.json({ message: 'Faq cree.' }));    
    
    } catch(e){
        console.log(e);
        res.sendStatus(400);
    }
 });

  // Get an user faqs 
  apiRouter.param('idUser', async (req, res, next, idUser)=> {
     try{
         const faqs = await db.user_faq(idUser);
         console.log(faqs);
         req.faqs = faqs;
         next(); // go to apiRouter.get('/utilisateur/:idUser')
     } catch(e) {
         console.log(e);
         res.sendStatus(404);
     }
  });

  apiRouter.get('/utilisateur/:idUser',  (req, res, next)=>{
     res.status(200).json({faqs: req.faqs});
  });
   
 
 
 apiRouter.get('/faqs-users', async (req, res, next)=>{
     try {
         const FaqsUsers = await db.allFaqUser();
         res.status(200).json({FaqsUsers: FaqsUsers});
     } catch(e) {
         console.log(e);
         res.sendStatus(500);
     }
  });
   
   

   // Get an faq users  
  apiRouter.param('idFaq', async (req, res, next, idFaq)=> {
     try{
         const users = await db.faq_user(idFaq);
         req.users = users;
         next(); // go to apiRouter.get('/faq/:idFaq')
     } catch(e) {
         console.log(e);
         res.sendStatus(404);
     }
  });
     
     
  apiRouter.get('/faq/:idFaq',  (req, res, next)=>{
     res.status(200).json({users: req.users});
  });
   
   
   
   
    
  
   
   
 module.exports = apiRouter;