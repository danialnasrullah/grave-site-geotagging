import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD24rwukq6SN-azz4XXmTe5apAm-3_E5Vg",
  authDomain: "drp1-c0ab2.firebaseapp.com",
  projectId: "drp1-c0ab2",
  storageBucket: "drp1-c0ab2.firebasestorage.app",
  messagingSenderId: "1072850207583",
  appId: "1:1072850207583:web:857729ea85808e9d93acea",
  measurementId: "G-9RJF8B1X33"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const graves = [
  {
    name: 'Naseem Begum',
    profession: 'Musician',
    dateOfBirth: '1936-02-24',
    dateOfDeath: '1971-09-29',
    coordinates: { lat: 31.54858650571382, lng: 74.3075781 },
    imageUrl: 'https://i.postimg.cc/ht27D6TH/2025-10-0221.jpg',
    intro: 'Naseem Begum (1936–1971) was a celebrated Pakistani playback singer known as The Tragedy Queen for her deeply emotional and sorrowful film songs that defined the golden age of Pakistani cinema. Rising to prominence in the late 1950s, she quickly moved beyond comparisons to Noor Jehan and established her own powerful voice with iconic songs in films like Shaheed, Baji, Lutera, and Zarqa. She was the original voice behind the patriotic anthem "Ae Rah-e-Haq Ke Shaheedo," which continues to stir national pride. Trained by classical singer Mukhtar Begum, she began her career with Guddi Gudda (1956) and sang for over 30 films across Urdu and Punjabi cinema. For her exceptional contributions to music and morale during the 1965 Indo-Pak war, she received four Nigar Awards and the Pride of Performance from the President of Pakistan. Despite her success, her life was tragically cut short at the age of 35 due to pregnancy-related complications.'
  },
  {
    name: 'Feroz Nizami',
    profession: 'Musician',
    dateOfBirth: '1910-11-01',
    dateOfDeath: '1975-11-15',
    coordinates: { lat: 31.548583763599748, lng: 74.30744822324195 },
    imageUrl: 'https://i.postimg.cc/wj47MhCW/2.jpg',
    intro: 'Feroz Nizami was a legendary composer, classical vocalist, and music scholar who bridged the cinematic soundscapes of both pre-Partition India and post-Partition Pakistan. Revered as the "Ustad of Bombay" by artists like Lata Mangeshkar and Mohammed Rafi, he was the musical force behind the iconic film Jugnu (1947) and is credited with introducing Rafi to cinema. Trained in the Kirana Gharana tradition, Nizami fused classical, semi-classical, thumri, and Western elements in his film scores across over two dozen films spanning Lahore and Bombay.'
  },
  {
    name: 'Zahida Parveen',
    profession: 'Musician',
    dateOfBirth: '',
    dateOfDeath: '1975-05-07',
    coordinates: { lat: 31.548500, lng: 74.307400 },
    imageUrl: 'https://i.postimg.cc/hPtf8y1D/3.jpg',
    intro: 'Zahida Parveen was a revered Pakistani classical and playback singer, celebrated for her soulful renditions in the kafi style and honored with titles like The Nightingale and The Queen of Kafi. Trained in the Patiala Gharana tradition, she began her career at Radio Pakistan before making her mark in film music, performing geets, ghazals, and light classical pieces in multiple languages. Known for her collaborations with legendary artists and music directors, she left a profound impact on South Asian music culture through her emotive voice and mastery of raag-based compositions. Her legacy lives on through her daughter, Shahida Parveen, whom she mentored to carry forward the classical tradition she so passionately embodied.'
  },
  {
    name: 'Sahibzada Sikandar Shaheen',
    profession: 'Actor',
    dateOfBirth: '',
    dateOfDeath: '2004-06-09',
    coordinates: { lat: 31.549024619858127, lng: 74.30680663673671 },
    imageUrl: 'https://i.postimg.cc/zGnZy5HV/4.jpg',
    intro: 'Sikandar Shaheen was one of the most versatile actors, who had a master\'s degree in English literature. He was a lecturer before he began his long association with PTV, where he was also a producer, general manager, and vice principal of the PTV Academy. He also appeared in a film Bobby (1984), which was a diamond jubilee super hit film with Sri Lankan actress Sabeeta in the leading role and Javed Sheikh as hero.'
  },
  {
    name: 'Nargis urf Naggo',
    profession: 'Actress',
    dateOfBirth: '',
    dateOfDeath: '1972-01-05',
    coordinates: { lat: 31.548716051157832, lng: 74.3065370520771 },
    imageUrl: 'https://i.postimg.cc/8CR6XFJN/5.jpg',
    intro: 'Naggo was a renowned Pakistani dancer and film actress of the 1960s, celebrated for her captivating dance performances and commanding presence in both Punjabi and Urdu cinema. Emerging from Lahore\'s traditional red-light district, she transitioned from stage to screen, quickly becoming one of Lollywood\'s most sought-after item performers. Her expressive dance style and charisma earned her roles in nearly a hundred films, making her a central figure in the golden age of Pakistani film. Her life, however, was tragically cut short in a widely publicized murder tied to her marriage and the societal taboos surrounding women from courtesan backgrounds, leaving behind a legacy marked by both fame and deep tragedy.'
  },
  {
    name: 'Malkah Farah Aijaz urf Nadira',
    profession: 'Actress and Dancer',
    dateOfBirth: '1968-11-22',
    dateOfDeath: '1995-08-06',
    coordinates: { lat: 31.548724620299115, lng: 74.30646480974727 },
    imageUrl: 'https://i.postimg.cc/q7vNwmTX/6.jpg',
    intro: 'Nadira, born Malika Farah, was a celebrated Pakistani film actress and dancer known for her graceful performances and romantic screen presence, earning her the nickname "The White Rose." Rising to fame in the late 1980s, she became a prominent figure in Punjabi cinema, especially renowned for her roles as a mystical serpent in folklore-inspired films like Nachay Nagin and Jadoo Garni. With a career spanning over 50 films across Punjabi, Urdu, and Pashto languages, she captivated audiences with her emotive acting and dance. Though she left the industry after marriage, her tragic death in a robbery cut short a life and career still fondly remembered by fans of Lollywood\'s golden era.'
  },
  {
    name: 'Nawab Muhammad Shahnawaz Khan',
    profession: 'Politician',
    dateOfBirth: '1883-12-17',
    dateOfDeath: '1942-03-28',
    coordinates: { lat: 31.548183764226895, lng: 74.30708793673666 },
    imageUrl: 'https://i.postimg.cc/6QJHGvxX/7.jpg',
    intro: 'Nawab Sir Shahnawaz Khan Mamdot was a prominent Punjabi landowner, politician, and an influential figure in the Pakistan Movement. Hailing from the powerful Mamdot estate, he rose to become one of the largest landholders in undivided Punjab. Known for his close association with Muhammad Ali Jinnah, Mamdot played a pivotal role in reorganizing the Punjab Muslim League and was instrumental in hosting and funding the historic All-India Muslim League session in Lahore, where the demand for Pakistan was formally articulated. A committed advocate for Muslim political identity and autonomy, he was deeply invested in the idea of a separate nation for Muslims, using both his wealth and influence to advance the cause.'
  },
  {
    name: 'Khwaja Dil Muhammad',
    profession: 'Educator',
    dateOfBirth: '1887-02-09',
    dateOfDeath: '1961-05-28',
    coordinates: { lat: 31.548104, lng: 74.307344 },
    imageUrl: 'https://i.postimg.cc/xdKhtSKB/8.jpg',
    intro: 'Khwaja Dil Muhammad was a poet, translator, educator, textbook writer, lexicographer, and a mathematician. Born in Lahore, Khwaja Dil Muhammad was educated in traditional oriental knowledge first and then he did his MA in mathematics from Government College, Lahore. He began teaching at Lahore\'s Islamia College as a lecturer of mathematics in 1907, wrote Lala Siri Ram in volume three of his Khum Khana-i-Javed. Dil retired as principal in 1944.'
  },
  {
    name: 'Molana Noor Muhammad Batalvi',
    profession: 'Religious Leader',
    dateOfBirth: '',
    dateOfDeath: '1972-01-12',
    coordinates: { lat: 31.549176, lng: 74.307966 },
    imageUrl: 'https://i.postimg.cc/W1SX3bwN/9.jpg',
    intro: 'Molana Noor Muhammad Batalvi was a sincere and valiant member of the Khilafat Movement and Pakistan Movement who struggled all his life for Islam. According to his headstone, the shock of the fall of Dhaka in 1971 led to his eventual death.'
  }
];

export const importGraves = async () => {
  for (const grave of graves) {
    try {
      await addDoc(collection(db, 'graves'), grave);
      console.log(`Added: ${grave.name}`);
    } catch (error) {
      console.error(`Error adding ${grave.name}:`, error);
    }
  }
}; 