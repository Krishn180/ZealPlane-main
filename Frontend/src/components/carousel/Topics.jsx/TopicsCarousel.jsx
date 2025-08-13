import React, { useRef, useEffect, useState } from "react";
import { BsFillArrowLeftCircleFill, BsFillArrowRightCircleFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ContentWrapper from "../../contentWrapper/ContentWrapper";
import Img from "../../lazyLoadImage/Img";
import PosterFallback from "../../../assets/no-poster.png";
// import "./style.scss";

// Sample project data
const projectsData = [
  {
    id: "10001",
    name: "Terrifying Tales(English)",
    Publisher: "Swapnil Publication",
    description: "A collection of bone chilling horror stories that will give you nightmare fuel",
    startDate: "2023-04-01",
    endDate: "2024-04-01",
    status: "In Progress",
    genre: "Mystery",
    ThumnailLink: "https://kabircomics.com/wp-content/uploads/2023/07/khaufnak-kisse.jpeg",
    teamMembers: [
      {
        id: "1",
        name: "Krishna Kumar",
        role: "Author",
        email: "krishnakumar050.kk@gmail.com"
      },
      {
        id: "2",
        name: "Swapnil Singh",
        role: "Editor",
        email: "mark.twain@example.com"
      }
    ],
    tasks: [
      {
        id: "101",
        title: "Outline Story",
        description: "Create a detailed outline of the story.",
        status: "Completed",
        assignedTo: "Emily Bronte",
        dueDate: "2023-05-01"
      },
      {
        id: "102",
        title: "First Draft",
        description: "Write the first draft of the novel.",
        status: "In Progress",
        assignedTo: "Emily Bronte",
        dueDate: "2023-10-01"
      }
    ],
    links: {
      manuscript: "https://example.com/mystery-novel-manuscript"
    }
  },
  {
    id: "10002",
    name: "Forbidden Zone",
    Publisher: "Swapnil publication",
    description: "Forbidden Zone is a chilling horror comic book that takes readers deep into a place where the rules of reality no longer apply. Filled with eerie landscapes, monstrous creatures, and sinister secrets, it follows characters who venture into a cursed area from which few return. Every page drips with tension, fear, and the sense that something unspeakable is lurking just beyond the shadows.",
    genre: "Thriller",
    startDate: "2023-06-01",
    endDate: "2024-06-01",
    status: "In Progress",
    ThumnailLink: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjjm3Lv6g7xw8YJ5YaIwHWnpLi0n1msYAnLVTrT3KtRPMuwulYe9o7ngGWGxyA2HXvsK39SLgDtQ8sMqa_0BSoZsDh8XtFHcPdll8CiZi13uXNshEqFYZB2cJMdYee0PGaSvWQdVGFznRiC7CUECucRCCvZwD9ulc0ZPHzK2UpI5BxKL_wY6zvLiU0d1i4/w1152/Untitled514.png",
    teamMembers: [
      {
        id: "7",
        name: "Stan Lee",
        role: "Writer",
        email: "stan.lee@example.com"
      },
      {
        id: "8",
        name: "Jack Kirby",
        role: "Illustrator",
        email: "jack.kirby@example.com"
      }
    ],
    tasks: [
      {
        id: "105",
        title: "Storyline Creation",
        description: "Develop the storyline for the comic book series.",
        status: "Completed",
        assignedTo: "Stan Lee",
        dueDate: "2023-07-01"
      },
      {
        id: "106",
        title: "Character Design",
        description: "Create the visual design of the characters.",
        status: "In Progress",
        assignedTo: "Jack Kirby",
        dueDate: "2023-09-01"
      }
    ],
    links: {
      comicSeriesPage: "https://example.com/comic-book-series"
    }
  },
  {
    id: "10003",
    name: "Chullu aur Lutera Bhoot",
    Publisher: "Swapnil Publication",
    description: "A mobile application designed to help users manage their health and wellness routines.",
    startDate: "2023-05-01",
    endDate: "2024-01-01",
    status: "Completed",
    genre: "Comedy",
    ThumnailLink: "https://i.ibb.co/CBhPhB1/Whats-App-Image-2023-09-13-at-6-36-27-PM.jpg",
    teamMembers: [
      {
        id: "5",
        name: "Arvind",
        role: "writer",
        email: "null"
      },
      {
        id: "6",
        name: "Mohit Arya",
        role: "Artist",
        email: "louis.pasteur@example.com"
      }
    ],
    tasks: [
      {
        id: "105",
        title: "Design UI/UX",
        description: "Create the design for the user interface and user experience.",
        status: "Completed",
        assignedTo: "Marie Curie",
        dueDate: "2023-07-01"
      },
      {
        id: "106",
        title: "Develop Core Features",
        description: "Develop the core features of the app.",
        status: "In Progress",
        assignedTo: "Louis Pasteur",
        dueDate: "2023-12-01"
      }
    ],
    links: {
      prototype: "https://example.com/health-app-prototype"
    }
  },
  {
    id: "10004",
    name: "Goofy Dadu",
    Publisher: "Fiction Publication",
    description: "join the goofiness of Dadu, Fiction studio's leading designer cum destroyer.",
    startDate: "2023-05-01",
    endDate: "2024-01-01",
    status: "Completed",
    genre: "Comedy",
    ThumnailLink: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjhJzJzTjjN8Qc9Hkvom-1V4YiWUXCg59NCJ-i41BQ30ILmNRysafY8aBxdcidFQmoIzNLyy-7wP_9Q4rOXR-93Rz2TrJAEJbICbnMBSG-y0YtMUu9O2xwiSCyTwmnB2z0BohexJhZ5FEQ/s1600/70.jpg",
    teamMembers: [
      {
        id: "7",
        name: "Sushant Panda",
        role: "Creative head",
        email: "null"
      },
      {
        id: "8",
        name: "Santosh Kushwaha",
        role: "Artist",
        email: "louis.pasteur@example.com"
      }
    ],
    tasks: [
      {
        id: "105",
        title: "Design UI/UX",
        description: "Create the design for the user interface and user experience.",
        status: "Completed",
        assignedTo: "Marie Curie",
        dueDate: "2023-07-01"
      },
      {
        id: "106",
        title: "Develop Core Features",
        description: "Develop the core features of the app.",
        status: "In Progress",
        assignedTo: "Louis Pasteur",
        dueDate: "2023-12-01"
      }
    ],
    links: {
      prototype: "https://example.com/health-app-prototype"
    }
  },
  {
    id: "10005",
    name: "Sando ki duniya",
    Publisher: "Fiction Publication",
    description: "A mobile application designed to help users manage their health and wellness routines.",
    startDate: "2023-05-01",
    endDate: "2024-01-01",
    status: "Completed",
    genre: "Comedy",
    ThumnailLink: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgWrnkP1cijFOdNjn3uoVshmIeCsO6J7eCOkLjS4GCGQ3tlkDKBWTRhuDKuLQHdJWibxHa30jJ0u9NIHl90U87SvjZmIyCYtTdIwv7WLxObkDM1MHIMb4LNJoHL_FcP6oaNYTVVHhUp5vI/s1600/17.jpg",
    teamMembers: [
      {
        id: "9",
        name: "Sushant Panda",
        role: "Writer",
        email: "marie.curie@example.com"
      },
      {
        id: "10",
        name: "Santosh Kushwaha",
        role: "Artist",
        email: "louis.pasteur@example.com"
      }
    ],
    tasks: [
      {
        id: "105",
        title: "Design UI/UX",
        description: "Create the design for the user interface and user experience.",
        status: "Completed",
        assignedTo: "Marie Curie",
        dueDate: "2023-07-01"
      },
      {
        id: "106",
        title: "Develop Core Features",
        description: "Develop the core features of the app.",
        status: "In Progress",
        assignedTo: "Louis Pasteur",
        dueDate: "2023-12-01"
      }
    ],
    links: {
      prototype: "https://example.com/health-app-prototype"
    }
  },
  {
    id: "10006",
    name: "KarateKing",
    Publisher: "Fiction Publication",
    description: "Lets move on to new journey of our goofy Dadu",
    startDate: "2023-05-01",
    endDate: "2024-01-01",
    status: "Completed",
    genre: "Comedy",
    ThumnailLink: "https://fictionsaga.com/wp-content/uploads/2025/03/62.jpg",
    teamMembers: [
      {
        id: "5",
        name: "Marie Curie",
        role: "Project Manager",
        email: "marie.curie@example.com"
      },
      {
        id: "6",
        name: "Louis Pasteur",
        role: "Developer",
        email: "louis.pasteur@example.com"
      }
    ],
    tasks: [
      {
        id: "105",
        title: "Design UI/UX",
        description: "Create the design for the user interface and user experience.",
        status: "Completed",
        assignedTo: "Marie Curie",
        dueDate: "2023-07-01"
      },
      {
        id: "106",
        title: "Develop Core Features",
        description: "Develop the core features of the app.",
        status: "In Progress",
        assignedTo: "Louis Pasteur",
        dueDate: "2023-12-01"
      }
    ],
    links: {
      prototype: "https://example.com/health-app-prototype"
    }
  }
  ,{
    id: "10005",
    name: "Sando",
    Publisher: "Fiction Publication",
    description: "A mobile application designed to help users manage their health and wellness routines.",
    startDate: "2023-05-01",
    endDate: "2024-01-01",
    status: "Completed",
    genre: "Comedy",
    ThumnailLink: "https://res.cloudinary.com/datgyuhmy/image/upload/v1755019262/project_images/1755019260872-17-SANDO--images-0.jpg",
    teamMembers: [
      {
        id: "9",
        name: "Sushant Panda",
        role: "Writer",
        email: "marie.curie@example.com"
      },
      {
        id: "10",
        name: "Santosh Kushwaha",
        role: "Artist",
        email: "louis.pasteur@example.com"
      }
    ],
    tasks: [
      {
        id: "105",
        title: "Design UI/UX",
        description: "Create the design for the user interface and user experience.",
        status: "Completed",
        assignedTo: "Marie Curie",
        dueDate: "2023-07-01"
      },
      {
        id: "106",
        title: "Develop Core Features",
        description: "Develop the core features of the app.",
        status: "In Progress",
        assignedTo: "Louis Pasteur",
        dueDate: "2023-12-01"
      }
    ],
    links: {
      prototype: "https://example.com/health-app-prototype"
    }
  },
  {
    id: "10007",
    name: "Echoes of Anklets",
    Publisher: "Swapnil Publication",
    description: "Lets move on to new journey of our goofy Dadu A haunting jingle of tiny metallic bells, once a sign of celebration, now twisted into an omen. Their faint, rhythmic clinking slithers through the silence, echoing like a ghost’s footsteps—each note a whisper that something unseen is drawing closer.",
    startDate: "2023-05-01",
    endDate: "2024-01-01",
    status: "Completed",
    genre: "Comedy",
    ThumnailLink: "https://res.cloudinary.com/datgyuhmy/image/upload/v1745136966/project_images/qbx2odx6gmglbsg2mvce.jpg",
    teamMembers: [
      {
        id: "5",
        name: "Marie Curie",
        role: "Project Manager",
        email: "marie.curie@example.com"
      },
      {
        id: "6",
        name: "Louis Pasteur",
        role: "Developer",
        email: "louis.pasteur@example.com"
      }
    ],
    tasks: [
      {
        id: "105",
        title: "Design UI/UX",
        description: "Create the design for the user interface and user experience.",
        status: "Completed",
        assignedTo: "Marie Curie",
        dueDate: "2023-07-01"
      },
      {
        id: "106",
        title: "Develop Core Features",
        description: "Develop the core features of the app.",
        status: "In Progress",
        assignedTo: "Louis Pasteur",
        dueDate: "2023-12-01"
      }
    ],
    links: {
      prototype: "https://example.com/health-app-prototype"
    }
  }
  // Add more projects if needed
];

const TopicCarousel = ({ title }) => {
    const carouselContainer = useRef();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Function to generate custom links based on ID
    const getCustomLink = (id) => {
          const customLinks = {
        "10001":"https://comicplane.site/viewer/687dfe4ce597f473fee4b2fa-red-scarf-english?start=0",
        "10002":"https://comicplane.site/viewer/689b7bee841e0e7c176cf810-khoufnaak-kisse-nisshidh-sthal?start=0",
        "10003": "https://comicplane.site/viewer/67b417e1b58fee068ef0be8d-chullu-aur-lootera-bhoot?start=0",
        "10004": "https://comicplane.site/viewer/684d4a3c88b4ebf3500120f6-?start=0",
        "10005": "https://comicplane.site/viewer/689b75c3841e0e7c176cf278-sando-ke-naye-kaarnaame?start=0",
        "10006": "https://comicplane.site/viewer/6862177c99fa95d08709ecb1-pagla-dadu-ke-naye-karnamen?start=0",
        "10007": "https://comicplane.site/viewer/6804accbdab5a44638dcab69-khauphanaak-kisse-ghunghat-ki-aawaaj?start=1",
        "10008": "https://comicplane.site/viewer/6862054388b4ebf35001fba8-sando-ki-duniya?start=0",
        "10009": "https://comicplane.site/viewer/6862177c99fa95d08709ecb1-pagla-dadu-ke-naye-karnamen?start=0",
    };
        return customLinks[id] || `/home/${id}`; // fallback to internal route
    };

    useEffect(() => {
        setData(
            projectsData.map((item) => ({
                ...item,  
                thumbnailLink: item.ThumnailLink || PosterFallback,
                userName: item.name,
                link: getCustomLink(item.id),
            }))
        );
        setLoading(false);
    }, []);

    const navigation = (dir) => {
        const container = carouselContainer.current;
        const scrollAmount =
            dir === "left"
                ? container.scrollLeft - (container.offsetWidth + 20)
                : container.scrollLeft + (container.offsetWidth + 20);

        container.scrollTo({
            left: scrollAmount,
            behavior: "smooth",
        });
    };

    const skItem = () => {
        return (
            <div className="skeletonItem">
                <div className="posterBlock skeleton"></div>
                <div className="textBlock">
                    <div className="title skeleton"></div>
                    <div className="date skeleton"></div>
                </div>
            </div>
        );
    };

    return (
        <div className="carousel">
            <ContentWrapper>
                {title && <div className="carouselTitle">{title}</div>}
                <BsFillArrowLeftCircleFill
                    className="carouselLeftNav arrow"
                    onClick={() => navigation("left")}
                />
                <BsFillArrowRightCircleFill
                    className="carouselRighttNav arrow"
                    onClick={() => navigation("right")}
                />
                {!loading ? (
                    <div className="carouselItems" ref={carouselContainer}>
                        {data?.map((item) => {
                            return (
                                <div
                                    key={item.id}
                                    className="carouselItem"
                                    onClick={() =>
                                        item.link.startsWith("http")
                                            ? window.open(item.link, "_blank")
                                            : navigate(item.link)
                                    }
                                >
                                    <div className="posterBlock">
                                        <Img src={item.thumbnailLink} />
                                        <img
                                            src={item.userProfilePic}
                                            alt=""
                                            className="avatarImage"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate("/profile");
                                            }}
                                        />
                                    </div>
                                    <div className="textBlock">
                                        <span className="title">
                                            {item.userName}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="loadingSkeleton">
                        {skItem()}
                        {skItem()}
                        {skItem()}
                        {skItem()}
                        {skItem()}
                    </div>
                )}
            </ContentWrapper>
        </div>
    );
};

export default TopicCarousel;