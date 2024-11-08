const CLOUD_NAME = 'dunvwejii';
const UPLOAD_PRESET = 'tz0y5sfc';
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

// Crear una funcion que reciba un archivo y el id del usuario y lo suba a Cloudinary
export async function uploadprofileImage(file: File, userId: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('public_id', userId);

    try {
        const response = await fetch(CLOUDINARY_URL, {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        console.log('Imagen subida:', data);
        return data; // Devolver los datos completos, incluyendo `secure_url`
    } catch (error) {
        console.error('Error al subir la imagen:', error);
        throw error;
    }
}