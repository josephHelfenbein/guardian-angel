<!-- Improved compatibility of back to top link: See: https://github.com/josephHelfenbein/hacknyu/pull/73 -->
<a id="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">

<a href="https://github.com/josephHelfenbein/hacknyu">
  
  </a><h3>Guardian Angel</h3>

  <p align="center">
    Stay alert, drive safe—AI-powered detection for distraction-free roads.
    <br />
    <a href="https://hacknyu-nine.vercel.app/">Visit</a>
    ·
    <a href="https://github.com/josephHelfenbein/hacknyu/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/josephHelfenbein/hacknyu/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#get-started">Get Started</a>
    </li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

Drowsy and distracted driving is a major cause of road accidents, often leading to severe consequences. We wanted to create a real-time AI-powered solution that helps drivers stay focused and safe by detecting when they look at their phone or close their eyes for too long.

<img src='https://github.com/josephHelfenbein/hacknyu/blob/f0b897dc05164a42dbb41964b95ee6d6976ee2ba/demo.gif' width='1000' />
  
### How it works

<img src='https://github.com/josephHelfenbein/hacknyu/blob/f0b897dc05164a42dbb41964b95ee6d6976ee2ba/public/guardian_angel_system_diagram.png' width=500 />

Guardian Angel continuously monitors the driver’s face using computer vision to detect signs of distraction or drowsiness. If the driver looks at their phone or closes their eyes for too long, the system sends an alert to help them refocus on the road.

Frontend: Built with Next.js/React for a smooth and responsive user experience.

Backend: Powered by FastAPI, handling requests efficiently.

AI Processing: Uses OpenCV to track eye direction and detect closed eyes.

Real-time Video Streaming: Utilizes WebRTC to send the video feed to the backend for processing.



<p align="right">(<a href="#readme-top">back to top</a>)</p>


### Built With

* [![Next.js][Next.js]][Next-url]
* [![React][React.js]][React-url]
* [![Tailwind][Tailwind]][Tailwind-url]
* [![FastAPI][FastAPI]][FastAPI-url]
* [![WebRTC][WebRTC]][WebRTC-url]
* [![OpenCV][OpenCV]][OpenCV-url]
* [![MediaPipe][MediaPipe]][MediaPipe-url]

Programmed in
* [![TypeScript][TypeScript]][TypeScript-url]
* [![Python][Python]][Python-url]
  
Powered by
* [![Vercel][Vercel]][Vercel-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



## Get started

Here are the steps to run the project locally if you want to develop your own project.

### Prerequisites

* npm
  ```sh
  npm install npm@latest -g
  ```

You can run the project using 
```sh
npm run server
```


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Project Link: [https://github.com/josephHelfenbein/hacknyu](https://github.com/josephHelfenbein/hacknyu)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

This project was submitted to the HackNYU 2025 hackathon for the Lifestyle/Health track.

Devpost link: [https://devpost.com/software/guardian-angel-6rlzkt](https://devpost.com/software/guardian-angel-6rlzkt)

* [Best README Template](https://github.com/othneildrew/Best-README-Template)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/josephHelfenbein/hacknyu.svg?style=for-the-badge
[contributors-url]: https://github.com/josephHelfenbein/hacknyu/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/josephHelfenbein/hacknyu.svg?style=for-the-badge
[forks-url]: https://github.com/josephHelfenbein/hacknyu/network/members
[stars-shield]: https://img.shields.io/github/stars/josephHelfenbein/hacknyu.svg?style=for-the-badge
[stars-url]: https://github.com/josephHelfenbein/hacknyu/stargazers
[issues-shield]: https://img.shields.io/github/issues/josephHelfenbein/hacknyu.svg?style=for-the-badge
[issues-url]: https://github.com/josephHelfenbein/hacknyu/issues
[license-shield]: https://img.shields.io/github/license/josephHelfenbein/hacknyu.svg?style=for-the-badge
[license-url]: https://github.com/josephHelfenbein/hacknyu/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[product-screenshot]: https://github.com/josephHelfenbein/hacknyu/blob/main/product-screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React.js-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 
[Expo]: https://img.shields.io/badge/expo-000000?style=for-the-badge&logo=expo&logoColor=white
[Expo-url]: https://expo.dev/
[Flask]: https://img.shields.io/badge/flask-4590A1?logo=flask&style=for-the-badge&logoColor=white
[Flask-url]: https://flask.palletsprojects.com/en/3.0.x/
[JavaScript]: https://img.shields.io/badge/javascript-yellow?logo=javascript&style=for-the-badge&logoColor=white
[JavaScript-url]: https://developer.oracle.com/languages/javascript.html
[ThreeJS]: https://img.shields.io/badge/three.js-black?logo=three.js&style=for-the-badge&logoColor=white
[ThreeJS-url]: https://threejs.org/
[TypeScript]: https://img.shields.io/badge/typescript-3178C6?logo=typescript&style=for-the-badge&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[Python]: https://img.shields.io/badge/python-3776AB?style=for-the-badge&logo=python&logoColor=white
[Python-url]: https://www.python.org/
[Amazon-RDS]: https://img.shields.io/badge/amazon%20rds-527FFF?style=for-the-badge&logo=amazon%20rds&logoColor=white
[Amazon-RDS-url]: https://aws.amazon.com/rds/
[Cloudflare]: https://img.shields.io/badge/cloudflare%20workers-F38020?style=for-the-badge&logo=cloudflare%20workers&logoColor=white
[Cloudflare-url]: https://workers.cloudflare.com/
[Vercel]: https://img.shields.io/badge/vercel-000000?logo=vercel&style=for-the-badge&logoColor=white
[Vercel-url]: https://www.vercel.com/
[Supabase]: https://img.shields.io/badge/supabase-3FCF8E?logo=supabase&style=for-the-badge&logoColor=white
[Supabase-url]: https://supabase.com/
[Clerk]: https://img.shields.io/badge/clerk-6C47FF?logo=clerk&style=for-the-badge&logoColor=white
[Clerk-url]: https://clerk.com/
[Onchainkit]: https://img.shields.io/badge/Onchainkit-0052FF.svg?logo=data:image/svg%2bxml;base64,PHN2ZyB3aWR0aD0iODAwcHgiIGhlaWdodD0iODAwcHgiIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgIDxjaXJjbGUgY3g9IjUxMiIgY3k9IjUxMiIgcj0iNTEyIiBzdHlsZT0iZmlsbDojMDA1MmZmIi8+CiAgIDxwYXRoIGQ9Ik01MTYuMyAzNjEuODNjNjAuMjggMCAxMDguMSAzNy4xOCAxMjYuMjYgOTIuNDdINzY0Qzc0MiAzMzYuMDkgNjQ0LjQ3IDI1NiA1MTcuMjcgMjU2IDM3Mi44MiAyNTYgMjYwIDM2NS42NSAyNjAgNTEyLjQ5UzM3MCA3NjggNTE3LjI3IDc2OGMxMjQuMzUgMCAyMjMuODItODAuMDkgMjQ1Ljg0LTE5OS4yOEg2NDIuNTVjLTE3LjIyIDU1LjMtNjUgOTMuNDUtMTI1LjMyIDkzLjQ1LTgzLjIzIDAtMTQxLjU2LTYzLjg5LTE0MS41Ni0xNDkuNjguMDQtODYuNzcgNTcuNDMtMTUwLjY2IDE0MC42My0xNTAuNjZ6IiBzdHlsZT0iZmlsbDojZmZmIi8+Cjwvc3ZnPg==&style=for-the-badge
[Onchainkit-url]: https://onchainkit.xyz/
[Llamaindex-url]: https://www.llamaindex.ai/
[Llamaindex]: https://img.shields.io/badge/llamaindex-FF3621?logo=databricks&style=for-the-badge&logoColor=white
[Lancedb-url]: https://lancedb.com/
[Lancedb]: https://img.shields.io/badge/lancedb-FF3621?logo=databricks&style=for-the-badge&logoColor=white
[Tailwind]: https://img.shields.io/badge/tailwind%20css-06B6D4?logo=tailwindcss&style=for-the-badge&logoColor=white
[Tailwind-url]: https://tailwindcss.com/
[Polygon]:  https://img.shields.io/badge/polygon.io-5F5CFF.svg?logo=data:image/svg%2bxml;base64,PHN2ZyB3aWR0aD0iNjAwcHgiIGhlaWdodD0iMjAwcHgiIHZpZXdCb3g9IjAgMCA2MDAgMjAwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogPGcgaWQ9ImxvY2t1cC1ob3Jpei1kYXJrIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KIDxyZWN0IGlkPSJib3giIGZpbGw9IiM1RjVDRkYiIHg9IjAiIHk9IjAiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj4KPC9yZWN0Pgo8cGF0aCBkPSJNMTAwLjQ2MjU0NCwzNiBMMTM3LjE0Mjg1Nyw3My4yOTk4MTUgTDEzMC41ODIzNjgsODEuNzUxMDcyNiBMMTAwLjI4MTY3NCwxNjQgTDgyLjIyOTU4NjcsMTA2LjU4MTk3NyBMNjQsNzIuODQ4NzUzOCBMMTAwLjQ2MjU0NCwzNiBaIE0xMjIuMTQxLDkxLjAyOSBMMTAyLjA4NDI4LDExNi44NTU4MzcgTDEwMi4wODQsMTQ1LjQ3MyBMMTIyLjE0MSw5MS4wMjkgWiBNMTAyLjQ1Myw0NC43OTEgTDg3LjAwMSwxMDYuMDU0IEw5Ny41MjMsMTM5LjUyIEw5Ny41MjM4MDk1LDExNS4xMjU2OTcgTDEzMC4yMTksNzMuMDI2IEwxMDIuNDUzLDQ0Ljc5MSBaIE05Ny4xMzEsNDYuMTEyIEw2OS44Mjk1ODQ1LDczLjcwMzg5MTYgTDgzLjY5OSw5OS4zNjggTDk3LjEzMSw0Ni4xMTIgWiIgaWQ9InBvbHlMb2dvIiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iPgogICA8L3BhdGg+CiAgPC9nPgo8L3N2Zz4=&style=for-the-badge
[Polygon-url]: https://polygon.io/
[FastAPI]: https://img.shields.io/badge/fastapi-009688?logo=fastapi&style=for-the-badge&logoColor=white
[FastAPI-url]: https://fastapi.tiangolo.com/
[WebRTC]: https://img.shields.io/badge/webrtc-333333?logo=webrtc&style=for-the-badge&logoColor=white
[WebRTC-url]: https://webrtc.org/
[OpenCV]: https://img.shields.io/badge/opencv-5C3EE8?logo=opencv&style=for-the-badge&logoColor=white
[OpenCV-url]: https://opencv.org/
[MediaPipe]: https://img.shields.io/badge/mediapipe-0097A7?logo=mediapipe&style=for-the-badge&logoColor=white
[MediaPipe-url]: https://ai.google.dev/edge/mediapipe/solutions/guide
