import type{ Phone, Expert } from '../types/index';

// Функція для створення красивого посилання-заглушки з назвою телефону
const getPhotoUrl = (text: string) => `https://placehold.co/400x400/eeeeee/31343c?text=${encodeURIComponent(text)}`;

export const INITIAL_PHONES: Phone[] = [
  { id: 'p1', brand: 'Apple', model: 'iPhone 15 Pro', photo: getPhotoUrl('iPhone 15 Pro') },
  { id: 'p2', brand: 'Samsung', model: 'Galaxy S24 Ultra', photo: getPhotoUrl('S24 Ultra') },
  { id: 'p3', brand: 'Google', model: 'Pixel 8 Pro', photo: getPhotoUrl('Pixel 8 Pro') },
  { id: 'p4', brand: 'Xiaomi', model: '14 Pro', photo: getPhotoUrl('Xiaomi 14 Pro') },
  { id: 'p5', brand: 'OnePlus', model: '12', photo: getPhotoUrl('OnePlus 12') },
  { id: 'p6', brand: 'Asus', model: 'ROG Phone 8', photo: getPhotoUrl('ROG Phone 8') },
  { id: 'p7', brand: 'Sony', model: 'Xperia 1 V', photo: getPhotoUrl('Xperia 1 V') },
  { id: 'p8', brand: 'Nothing', model: 'Phone (2)', photo: getPhotoUrl('Nothing (2)') },
  { id: 'p9', brand: 'Motorola', model: 'Edge 50 Pro', photo: getPhotoUrl('Edge 50 Pro') },
  { id: 'p10', brand: 'Huawei', model: 'P60 Pro', photo: getPhotoUrl('P60 Pro') },
  { id: 'p11', brand: 'Oppo', model: 'Find X7 Ultra', photo: getPhotoUrl('Find X7') },
  { id: 'p12', brand: 'Vivo', model: 'X100 Pro', photo: getPhotoUrl('X100 Pro') },
  { id: 'p13', brand: 'Realme', model: 'GT 5 Pro', photo: getPhotoUrl('GT 5 Pro') },
  { id: 'p14', brand: 'Honor', model: 'Magic 6 Pro', photo: getPhotoUrl('Magic 6 Pro') },
  { id: 'p15', brand: 'Apple', model: 'iPhone 13', photo: getPhotoUrl('iPhone 13') },
  { id: 'p16', brand: 'Samsung', model: 'Galaxy A54', photo: getPhotoUrl('Galaxy A54') },
  { id: 'p17', brand: 'Google', model: 'Pixel 7a', photo: getPhotoUrl('Pixel 7a') },
  { id: 'p18', brand: 'Xiaomi', model: 'Redmi Note 13', photo: getPhotoUrl('Redmi Note 13') },
  { id: 'p19', brand: 'Motorola', model: 'Moto G84', photo: getPhotoUrl('Moto G84') },
  { id: 'p20', brand: 'Poco', model: 'X6 Pro', photo: getPhotoUrl('Poco X6 Pro') },
];

export const INITIAL_EXPERTS: Expert[] = [
  { id: 't1', name: 'Викладач (Адмін)', isTeacher: true },
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `e${i + 1}`,
    name: `Експерт ${i + 1}`
  }))
];