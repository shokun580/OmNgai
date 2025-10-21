import { Router, type Request, type Response } from "express";
const router = Router();
import userModel from "../models/userModel";
import { upload } from "../utils/upload";

router.get("/user", async (req: Request, res: Response): Promise<void> => {
    const result = await userModel.getallUser();
    if(result.length > 0){
        res.json({ status: "ok", message: 'success to get all Users', data: result[0] })
    }
});
router.get("/user/:id", async (req:Request, res:Response): Promise<void> =>{
    const userId = req.params;
    const result = await userModel.getUserById(Number(userId.id));
    if(result.length > 0){
        res.json({ status: "ok", message: 'success to get Users By ID', data: result[0] })
    }
});
router.post("/user", async (req:Request, res:Response): Promise<void> =>{
    const newUser = req.body;
    const result = await userModel.addNewUser(Number(newUser.tit_id), String(newUser.fname),
        String(newUser.lname), String(newUser.username), String(newUser.password));
    if(result.length > 0){
        res.json({ status: "ok", message: 'success to add new Users', data: newUser });
    }
});
router.put("/update", async (req:Request, res:Response): Promise<void> =>{
    const Userinfo = req.body;
    const result = userModel.updateUser(
        Number(Userinfo.tit_id),
        String(Userinfo.fname),
        String(Userinfo.lname),
        String(Userinfo.username),
        String(Userinfo.password),
        Number(Userinfo.id)
    );
    res.json({ status: "ok", message: 'success to Update Users', data: Userinfo });
});
router.delete("/user/delete/:id" , async (req:Request, res:Response): Promise<void> =>{
    const target = req.params;
    const result = userModel.deleteUser(Number(target.id));
    res.json({ status: "ok", message: 'success to Delete Users' });
});
router.post("/user/:id/upload", upload.single("image"), async (req:Request, res:Response): Promise<void> =>{
    const target = req.params;
    const file = req.file;
    if (!req.file) {
        res.status(400).json({ status: 'error', message: 'No file uplaoded' });
    } else {
        res.json({ status: 'ok', filename: req.file.filename });
        const result = await userModel.addAvatar(String(req.file.filename), Number(target.id));
        if (result.length > 0) {
            res.json({ status: "ok", message: 'success to delete Users', data: file });
        } else {
            res.json({ status: 'error', data: [] });
        }
    }
});




export default router;