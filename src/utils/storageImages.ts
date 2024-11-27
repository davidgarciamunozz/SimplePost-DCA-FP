const CLOUD_NAME = 'dunvwejii';
const UPLOAD_PRESET = 'tz0y5sfc';
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

// function to upload a profile image to Cloudinary
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
        // console.log('Imagen subida:', data);
        return data;
    } catch (error) {
        console.error('Error al subir la imagen:', error);
        throw error;
    }
}

// receive a file and upload it to Cloudinary
export async function uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
        const response = await fetch(CLOUDINARY_URL, {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        // console.log('Imagen subida:', data);
        return data; 
    } catch (error) {
        console.error('Error al subir la imagen:', error);
        throw error;
    }
}