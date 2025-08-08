import bcrypt from 'bcrypt';

// Define the salt rounds
const saltRounds = 10;

// Function to hash a password
export async function hashPassword(password: string): Promise<string> {
    try {
        const hash = await bcrypt.hash(password, saltRounds);
        return hash;
    } catch (error) {
        throw new Error('Error hashing password: ' + error.message);
    }
}

// Function to verify a password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
        const isMatch = await bcrypt.compare(password, hash);
        return isMatch;
    } catch (error) {
        throw new Error('Error comparing passwords: ' + error.message);
    }
}

