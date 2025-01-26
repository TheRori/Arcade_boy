import {doc, imgHTMLContainer, magazines} from "./globals";

export function readMagazine(src) {
    imgHTMLContainer.style.display = 'block';

    doc.src = src;
    doc.style.display = 'block';
}

export function openLightBox(src) {
    imgHTMLContainer.style.display = 'block';
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');



    lightboxImg.src = src; // Utiliser la source de l'image actuelle
    lightbox.style.display = 'flex'; // Affiche la lightbox


    // Ajoutez ce listener pour fermer la lightbox au clic sur le bouton de fermeture
    lightboxClose.addEventListener('click', () => {
        lightbox.style.display = 'none'; // Cache la lightbox
    });
}