
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key. Make sure .env is set up correctly.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const graves = [
    {
        name: 'Naseem Begum',
        profession: 'Musician',
        dateOfBirth: '1936-02-24',
        dateOfDeath: '1971-09-29',
        age: 35, // Derived from text
        intro: 'Naseem Begum (1936–1971) was a celebrated Pakistani playback singer known as The Tragedy Queen. Rising to prominence in the late 1950s, she established her own powerful voice with iconic songs. She was the original voice behind "Ae Rah-e-Haq Ke Shaheedo". She received four Nigar Awards and the Pride of Performance.',
        coordinates: { lat: 31.54858650571382, lng: 74.3075781 },
        imageUrl: 'https://i.postimg.cc/ht27D6TH/2025-10-0221.jpg'
    },
    {
        name: 'Feroz Nizami',
        profession: 'Musician',
        dateOfBirth: '1910-11-01',
        dateOfDeath: '1975-11-15',
        age: 65,
        intro: 'Feroz Nizami was a legendary composer, classical vocalist, and music scholar. Revered as the "Ustad of Bombay", he was the musical force behind the iconic film Jugnu (1947) and is credited with introducing Rafi to cinema.',
        coordinates: { lat: 31.548583763599748, lng: 74.30744822324195 },
        imageUrl: 'https://i.postimg.cc/wj47MhCW/2.jpg'
    },
    {
        name: 'Zahida Parveen',
        profession: 'Musician',
        dateOfBirth: null,
        dateOfDeath: '1975-05-07',
        age: null,
        intro: 'Zahida Parveen was a revered Pakistani classical and playback singer, celebrated for her soulful renditions in the kafi style. Honored with titles like The Nightingale and The Queen of Kafi.',
        coordinates: { lat: 31.548500, lng: 74.307400 },
        imageUrl: 'https://i.postimg.cc/hPtf8y1D/3.jpg'
    },
    {
        name: 'Sahibzada Sikandar Shaheen',
        profession: 'Actor',
        dateOfBirth: null,
        dateOfDeath: '2004-06-09',
        age: null,
        intro: 'Sikandar Shaheen was a versatile actor with a masters degree in English literature. He was a lecturer, producer, general manager and vice principal of the PTV Academy. He appeared in the film Bobby (1984).',
        coordinates: { lat: 31.549024619858127, lng: 74.30680663673671 },
        imageUrl: 'https://i.postimg.cc/zGnZy5HV/4.jpg'
    },
    {
        name: 'Nargis urf Naggo',
        profession: 'Actress',
        dateOfBirth: null,
        dateOfDeath: '1972-01-05',
        age: null,
        intro: 'Naggo was a renowned Pakistani dancer and film actress of the 1960s. Emerging from Lahore’s traditional red-light district, she transitioned from stage to screen. Her life was tragically cut short, leaving behind a legacy marked by both fame and deep tragedy.',
        coordinates: { lat: 31.548716051157832, lng: 74.3065370520771 },
        imageUrl: 'https://i.postimg.cc/8CR6XFJN/5.jpg'
    },
    {
        name: 'Malkah Farah Aijaz urf Nadira',
        profession: 'Actress and Dancer',
        dateOfBirth: '1968-11-22',
        dateOfDeath: '1995-08-06',
        age: 26,
        intro: 'Nadira, born Malika Farah, was a celebrated Pakistani film actress and dancer known as "The White Rose." Rising to fame in the late 1980s, she was renowned for her roles in Punjabi cinema. She died tragically in a robbery.',
        coordinates: { lat: 31.548724620299115, lng: 74.30646480974727 },
        imageUrl: 'https://i.postimg.cc/q7vNwmTX/6.jpg'
    },
    {
        name: 'Nawab Muhammad Shahnawaz Khan',
        profession: 'Politician',
        dateOfBirth: '1883-12-17',
        dateOfDeath: '1942-03-28',
        age: 58,
        intro: 'Nawab Sir Shahnawaz Khan Mamdot was a prominent Punjabi landowner, politician, and an influential figure in the Pakistan Movement. He played a pivotal role in reorganizing the Punjab Muslim League and funded the historic session in Lahore.',
        coordinates: { lat: 31.548183764226895, lng: 74.30708793673666 },
        imageUrl: 'https://i.postimg.cc/6QJHGvxX/7.jpg'
    },
    {
        name: 'Khwaja Dil Muhammad',
        profession: 'Educator',
        dateOfBirth: '1887-02-09',
        dateOfDeath: '1961-05-28',
        age: 74,
        intro: 'Khwaja Dil Muhammad was a poet, translator, educator, textbook writer, lexicographer and a mathematician. He served as principal of Islamia College, Lahore.',
        coordinates: { lat: 31.548104, lng: 74.307344 },
        imageUrl: 'https://i.postimg.cc/xdKhtSKB/8.jpg'
    },
    {
        name: 'Molana Noor Muhammad Batalvi',
        profession: 'Religious Leader',
        dateOfBirth: null,
        dateOfDeath: '1972-01-12',
        age: null,
        intro: 'Molana Noor Muhammad Batalvi was a sincere and valiant member of the Khilafat Movement and Pakistan Movement who struggled all his life for Islam. Fall of Dhaka’s shock led to his eventual death.',
        coordinates: { lat: 31.549176, lng: 74.307966 },
        imageUrl: 'https://i.postimg.cc/W1SX3bwN/9.jpg' // Fixed: Moved from dateOfBirth to imageUrl
    }
];

async function seedData() {
    console.log('Seeding data...');

    for (const grave of graves) {
        // Transform to schema
        const newGrave = {
            name: grave.name,
            profession: grave.profession,
            dateOfBirth: grave.dateOfBirth,
            dateOfDeath: grave.dateOfDeath,
            age: grave.age,
            causeOfDeath: '', // Not provided in source list explicitly
            location: {
                address: '',
                section: '',
                coordinates: grave.coordinates
            },
            images: grave.imageUrl ? [grave.imageUrl.trim()] : [],
            intro: grave.intro,
            createdAt: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from('grave_sites')
            .insert([newGrave]);

        if (error) {
            console.error(`Error inserting ${grave.name}:`, error.message);
        } else {
            console.log(`Successfully added: ${grave.name}`);
        }
    }

    console.log('Seeding complete!');
}

seedData();
