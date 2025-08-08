import jwt from 'jsonwebtoken';


export async function   generateToken(data: any, expiresIn : string = '24h') {
    const token = jwt.sign({
        data: data
    }, `${process.env.CLIENT_SECRET}`, { expiresIn: expiresIn });
    return token;
}

export async function verifyToken(token: string)     {  
    const decoded =  jwt.verify(token, `${process.env.CLIENT_SECRET}`);
    return decoded;
}