import Amavas from "../assets/Amavas.jpeg";
import Amawas2 from "../assets/Amawas2.jpeg";
import KKPD from "../assets/KKPD.jpeg";
import Chullu1 from "../assets/Chullu1.jpeg";
import gmofdeath from "../assets/gmofdeath.jpg";
import dehek from "../assets/dehek-hin-1.jpg";

const products = [
  {
    id: 1,
    title: "Amawas",
    author: "Unknown", // Replace with actual author name
    price: 170,
    description:
      "A thrilling mystery novel full of suspense and unexpected twists.",
    image: Amavas, // Use imported image
    category: "Thriller",
    stock: 10,
  },
  {
    id: 2,
    title: "Amawas 2",
    author: "Unknown", // Replace with actual author name
    price: 170,
    description:
      "A thrilling mystery novel full of suspense and unexpected twists.",
    image: Amawas2, // Use imported image
    category: "Thriller",
    stock: 10,
  },
  {
    id: 3,
    title: "Khoon Ki Pyasi Doulat",
    author: "Unknown", // Replace with actual author name
    price: 120,
    description:
      "A spine-chilling horror story revolving around greed and bloodlust.",
    image: KKPD, // Use imported image
    category: "Horror",
    stock: 7,
  },
  {
    id: 4,
    title: "Chullu Aur Khadoos Uncle",
    author: "Unknown", // Replace with actual author name
    price: 120,
    description: "A humorous tale featuring Chullu and his grumpy uncle.",
    image: Chullu1, // Use imported image
    category: "Comedy",
    stock: 15,
  },
  {
    id: 5,
    title: "Game of Death",
    author: "Krishna", // Replace with actual author name
    price: 300,
    description:
      "An action-packed thriller filled with danger and high-stakes games.",
    image: gmofdeath, // Use imported image
    category: "Action",
    stock: 5,
  },
  {
    id: 6,
    title: "Dehek-hindi",
    Writer: "Vijayendra Mohanty", // Replace with actual author name
    Artist: "Abinash Ghosh, Tadam Gyadu",
    price: "619.00",
    description:
      "दहक एक महाशक्ति है, जिसके पास देवताओं जैसी शक्तियॉं हैं… या फिर यूं कहें कि उसे बचपन से यही बात सिखाई गई है।पर सच तो यह है कि वह अपने पिता मेजर शैतान सिंह के संरक्षण में उनके मिलिट्री कैंपस में अन्य दुर्लभ बच्चों के साथ अपनी शक्तियों को काबू करने का प्रशिक्षण ले रही है, जहॉं उसका जीवन एक उबाऊ चक्र में फंसकर रह गया है। इसी बीच एक तामसिक शक्ति उस मिलिट्री कैंपस पर धावा बोल देती है जिसे परास्त करना कैंपस में मौजूद किसी भी महामानव के लिए संभव नहीं, किंतु दहक बाकियों से अलग है, उसके भीतर शक्तिशाली ड्रैगनों का आह्वान करने की शक्ति है… पर दहक अभी अपनी शक्तियों का ढंग से प्रयोग करना नहीं जानती है, क्या ऐसे में वह एक ऐसी शक्ति का सामना कर पाएगी जिसे हराना एक नौसिखिए के बस की बात नहीं? जानने के लिए पढ़ें होली काऊ एंटरटेनमेंट की सर्वप्रथम फीमेल सुपरहीरो दहक का वॉल्यूम #1, जिसमें वह अपनी दैवीय शक्तियों का असल महत्व जानेगी।",
    image: dehek, // Use imported image
    category: "Action",
    binding: "Paperback",
    pages: "68",
  },
];

export default products;
