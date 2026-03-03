<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Le Plateau – Café culturel ludique et associatif à Bègles</title>

<meta name="description" content="Le Plateau est un café culturel ludique et associatif à Bègles : jeux de société, quiz, stand-up, impro et événements toute l’année.">
<meta property="og:title" content="Le Plateau – Café culturel à Bègles">
<meta property="og:description" content="Jeux de société et évennements conviviaux au cœur de Bègles.">
<meta property="og:type" content="website">

<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/main.css" type="text/css" media="screen" />
<script>
const images = document.querySelectorAll('.gallery-mosaic img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.querySelector('.lightbox-img');
const closeBtn = document.querySelector('.close');

images.forEach(img => {
    img.addEventListener('click', () => {
        lightbox.style.display = 'flex';
        lightboxImg.src = img.src;
    });
});

closeBtn.addEventListener('click', () => {
    lightbox.style.display = 'none';
});

lightbox.addEventListener('click', (e) => {
    if(e.target !== lightboxImg){
        lightbox.style.display = 'none';
    }
});
</script>
</head>

<body>
<div class="site-container">
<header>
<header>
    <?php include 'components/navbar.html'; ?>
    
</header>
<!-- INTRO -->
<section class="lieu-intro fade-up">

    <h1 class="section-title">Le lieu</h1>

    <div class="lieu-grid">

        <div class="lieu-text">
            <h2>Une idée devenue réalité</h2>
            <p>
                Le Plateau est né d’une envie simple :
                créer un espace chaleureux à Bègles
                où l’on puisse se retrouver autour du jeu,
                de la culture et du partage.
            </p>
            <p>
                Après des mois de réflexion, de travaux
                et d’énergie collective,
                le lieu a ouvert ses portes
                pour devenir un espace vivant et accessible à toutes et tous.
            </p>
        </div>

        <div class="lieu-image">
            <img src="assets/images/photo1.jpg" alt="Intérieur du Plateau">
        </div>

    </div>

</section>

<!-- BOIRE & MANGER -->
<section class="lieu-food fade-up">

    <h2 class="section-title">Boire & manger</h2>

    <div class="food-grid">

        <div class="food-card">
            <h3>Planches à partager</h3>
            <p>
                Des planches conviviales à partager :
                fromages, charcuterie et options végétariennes.
                Parfait pour accompagner une partie entre amis.
            </p>
        </div>

        <div class="food-card">
            <h3>Bières & vins</h3>
            <p>
                Une sélection de bières locales,
                du vin rouge, blanc ou rosé,
                pour trinquer dans une ambiance détendue.
            </p>
        </div>

        <div class="food-card">
            <h3>Softs</h3>
            <p>
                Softs, jus, boissons sans alcool :
                pour tous les âges et toutes les envies.
            </p>
        </div>

    </div>

</section>

<!-- GALERIE -->
<section class="lieu-gallery fade-up">

    <h2 class="section-title">L’ambiance</h2>

    <div class="gallery-mosaic">

        <img src="assets/images/photo1.jpg" alt="" class="big">
        <img src="assets/images/photo2.jpg" alt="">
        <img src="assets/images/photo3.jpg" alt="">
        <img src="assets/images/photo4.jpg" alt="" class="tall">
        <img src="assets/images/photo1.jpg" alt="">
        <img src="assets/images/photo2.jpg" alt="">

    </div>

</section>

<!-- Lightbox -->
<div class="lightbox" id="lightbox">
    <span class="close">&times;</span>
    <img class="lightbox-img" src="">
</div>

<!-- CONCLUSION -->
<section class="lieu-conclusion fade-up">

    <div class="conclusion-box">
        <p>
            Le Plateau, c’est un lieu de rencontres,
            de rires et de moments partagés.
            Un espace vivant au cœur de Bègles,
            pensé pour créer du lien.
        </p>
    </div>

</section>

<?php include 'components/footer.html'; ?>

<button id="topBtn">↑</button>

<script>

/* Scroll Animation */
const faders = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            entry.target.classList.add('visible');
        }
    });
},{ threshold:0.2 });

faders.forEach(el => observer.observe(el));

/* Back to top */
const topBtn = document.getElementById("topBtn");

window.addEventListener("scroll", () => {
    topBtn.style.display = window.scrollY > 300 ? "block" : "none";
});

topBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

</script>
</div>
</body>
</html>