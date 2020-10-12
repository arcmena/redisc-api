import { diskStorage } from 'multer';
import { resolve } from 'path';
import { randomBytes } from 'crypto';

export default {
    storage: diskStorage({
        destination: resolve(__dirname, '..', '..', 'uploads'),
        filename(req, file, callback) {
            const hash = randomBytes(6).toString('hex');

            const filename = `${hash}-${file.originalname}`;

            callback(null, filename);
        },
    }),
};
