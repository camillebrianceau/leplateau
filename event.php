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
const programImg = document.querySelector('.program-image');
const programLightbox = document.getElementById('programLightbox');
const programLightboxImg = programLightbox.querySelector('.lightbox-img');
const closeProgram = programLightbox.querySelector('.close');

if(programImg){
    programImg.addEventListener('click', () => {
        programLightbox.style.display = 'flex';
        programLightboxImg.src = programImg.src;
    });
}

closeProgram.addEventListener('click', () => {
    programLightbox.style.display = 'none';
});

programLightbox.addEventListener('click', (e) => {
    if(e.target !== programLightboxImg){
        programLightbox.style.display = 'none';
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
<section class="events-intro fade-up">

    <h1 class="section-title">Les événements</h1>

    <p class="intro-text">
        Chaque mois, Le Plateau propose une programmation variée :
        humour, jeux, culture, rencontres et surprises.
        Il y a toujours une bonne raison de passer.
    </p>

</section>

<!-- EVENTS FIXES -->
<section class="events-highlights fade-up">

    <div class="events-grid">

        <div class="event-card">
            <h3>Stand-up</h3>
            <p>Des soirées humour avec des artistes locaux et émergents.</p>
        </div>

        <div class="event-card">
            <h3>Impro</h3>
            <p>Des matchs d’impro et spectacles participatifs.</p>
        </div>

        <div class="event-card">
            <h3>Quiz & Blind Tests</h3>
            <p>Testez votre culture générale dans une ambiance conviviale.</p>
        </div>

        <div class="event-card">
            <h3>Tournois</h3>
            <p>Belote, tarot et jeux modernes pour tous les niveaux.</p>
        </div>

    </div>

</section>

<!-- PDF DU MOIS -->
<section class="events-program fade-up">

    <h2 class="section-title">Le programme du mois</h2>

    <?php
        $mois = date('m');
        $annee = date('Y');
        $imagePath = "assets/images/programmes/programme-$mois-$annee.jpg";
    ?>

    <div class="program-container">

        <?php if(file_exists($imagePath)) : ?>

            <img src="<?php echo $imagePath; ?>" 
                 alt="Programme du mois" 
                 class="program-image">

            <a href="<?php echo $imagePath; ?>" 
               class="simple-link" 
               download>
               > Télécharger le programme
            </a>

        <?php else : ?>

            <p>Le programme du mois arrive bientôt ✨</p>

        <?php endif; ?>

    </div>

</section>

<!-- Lightbox -->
<div class="lightbox" id="programLightbox">
    <span class="close">&times;</span>
    <img class="lightbox-img" src="">
</div>

<!-- INFOS -->
<section class="events-info fade-up">

    <div class="info-box">
        <h2>Infos pratiques</h2>
        <p>
            Certains événements nécessitent une réservation.
            Suivez-nous sur les réseaux pour ne rien manquer.
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