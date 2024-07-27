import {Connect} from "./Connection";
import express, { Request, Response } from 'express';
import { Upload } from "./File_Upload";
import path from 'path';
import bcrypt from 'bcrypt'

let Port  = process.env.PORT
const Data = express()
Data.use("/upload",express.static(path.join(__dirname,"upload")))


/* Get */

Data.get("/",(req:Request,res:Response) =>
{
    Connect.query(`SELECT customer_mode, COUNT(customer_id) FROM payment GROUP BY customer_mode`,(err,data) =>
    {
        if(err)
        {
            console.log("Qurey Error",err);
            
        }
        else
        {
            res.send(data)
        }
    })
})

/* Post */

Data.post("/",Upload.single("img"), async (req:Request,res:Response) =>
{
    let file_path:any = req.file?.path
    file_path = file_path?.replace(/\\/g, '/')
    let Data = req.body
    let Hash_Password = await bcrypt.hash(Data.password,10)
    let setdata:any =
    {
        "name": Data.name,
        "email" : Data.email,
        "password" : Hash_Password,
         img :`http://localhost:${Port}/${req.body.img = file_path}`
    }

    Connect.query(`SELECT * FROM table_data WHERE email=?`,[Data.email], (err, rows: any) =>
    {
        if (err)
        {
            res.send("Database Qurey Error")
            console.log("Error ==> ",err);
        }
        else
        {
            if (rows.length > 0)
            {
                res.status(400).send({msg:"Email Already Exits..",Data:{Data:Data.email}})
            }
            else
            {
                Connect.query("INSERT INTO table_data SET ?", [setdata], (err) =>
                {
                    if (err)
                    {
                        console.log("Query Error....", err);
                    }
                    else
                    {
                        res.status(200).send({msg:"Add Succesfully...",setdata:setdata})  
                    }      
                })
            }
        }
    })
})

/* Update  */

Data.put("/data_update",Upload.single("img"),(req:Request,res:Response) =>
{   
    let Data = req.body
    let setdata :any =
    {
        "name": Data.name,
        "email" : Data.email,
        "password" : Data.password,
        img :`http://localhost:9020/${req.body.img = req.file?.path}`
    } 
    Connect.query(`UPDATE table_data SET ? WHERE id=?`,[setdata,Data.id],(err) =>
    {
        if(err)
        {
            res.send("Update Qurey Error")
            console.log("Update ===> ",err);
            
        }
        else
        {
            setdata['id'] = Data.id
            res.send({msg:"Data Update Successfully...",data_1:setdata})
        }    
    })
})

/* Delete */

Data.delete("/data",(req:Request,res:Response) =>
{
    let id = req.query.id
    let Data = req.body
    Connect.query(`DELETE FROM table_data WHERE id=?`,[id],(err) =>
    {
        if(err)
        {
            res.send("Delete Qurey Error")
            console.log("Delete ===> ",err);
        }
        else
        {
            res.send({msg:"User Delete SuccessFully",Data:Data})
            console.log("User Delete Successfully...")
        }    
    })
})

/* Server Listen */

Data.listen(Port,() =>
{
    console.log(`Server Is Running On htpp://localhost:${Port}`);
})