import multer from 'multer';
import { Request } from 'express';
import path from 'path'

const File = multer.diskStorage
({
    destination:"upload",
    filename:(req:Request,file,cb) =>
    {
        cb(null,file.fieldname +'-'+ Date.now()+file.originalname)
    }    
})

const File_Upload_Check:any = (req:Request,file:any,cb:any,res:Response) => 
{
    const ext:any = path.extname(file.originalname)

    if(ext.toLowerCase() !=='.png' && ext.toLowerCase() !=='.jpeg' && ext.toLowerCase() !=='.jpg')
    {
        throw new Error("Only Allow .png, .jpg, .jpeg...")
    }
    else
    {
         cb(null,true)
    }
}

export const Upload:any = multer
({
    storage: File,
    fileFilter: File_Upload_Check
})