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

</head>

<body>
<div class="site-container">
<header>
<header>
    <?php include 'components/navbar.html'; ?>
    
</header>

<section id="contact" class="fade-up">
    <iframe 
        src="https://www.google.com/maps?q=5+Place+du+14+Juillet+33130+Bègles&output=embed"
        allowfullscreen="" loading="lazy"></iframe>
    
    <p>
        <strong>Adresse :</strong><br>
        5 Place du 14 Juillet<br>
        33130 BÈGLES<br><br>
        <strong>Horaires :</strong><br>
		lundi: fermé<br>
		mardi: 16h à 21h30<br>
		mercredi: 16h 23h<br>
		jeudi: 16h à 22h<br>
		vendredi: 16h à 22h <br>
		samedi: 9h30 à 12h - 17h à 22h <br>
		dimanche: 14h à 19h<br><br>
        <strong>Contact :</strong><br>
        📧 contact@leplateau.fr<br>
        📞 05 00 00 00 00
    </p>
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