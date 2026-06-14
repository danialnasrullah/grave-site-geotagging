import { supabase } from '../supabaseClient';

// Uploads an array of File objects to the Supabase `grave-images` bucket and
// returns the list of public URLs in the same order. Throws on the first
// failure so callers can surface the error to the user (never swallowed).
export async function uploadImageFiles(files) {
  if (!files || files.length === 0) {
    return [];
  }

  const uploadedUrls = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const safeName = (file.name || `capture_${i}.jpg`).replace(/[^a-zA-Z0-9.]/g, '');
    const fileName = `graves/${Date.now()}_${i}_${safeName}`;

    const { error } = await supabase.storage
      .from('grave-images')
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading image:', error);
      throw error;
    }

    const { data: publicData } = supabase.storage
      .from('grave-images')
      .getPublicUrl(fileName);

    uploadedUrls.push(publicData.publicUrl);
  }

  return uploadedUrls;
}
