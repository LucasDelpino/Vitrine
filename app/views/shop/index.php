<?php require __DIR__ . '/../layouts/header.php'; ?>

<section class="hero-home">
    <div class="hero-content">
        <h1>L’élégance façonnée par la passion</h1>
        <p>Chaque bijou raconte une histoire. La vôtre.</p>
        <a href="/shop" class="btn-hero">Découvrir la collection</a>
    </div>
</section>
<div class="story-values">
    <section class="story">
        <div class="story-text">
            <h2>Mon histoire</h2>
            <p>
                Jeune créatrice de 24 ans, originaire du sud de la France, passionnée par la mode et plus particulièrement par l’univers du bijou.
                Tout a commencé par la création de bijoux pour moi-même, afin d’apporter une touche finale unique à mes tenues.
                Très vite, cette passion est devenue une évidence : celle de partager mes créations avec vous.
                Je conçois des bijoux en acier inoxydable, imaginés et réalisés avec soin.
                Chaque pièce est unique, pensée pour sublimer votre style, illuminer vos tenues et vous aider à briller au quotidien.
                À travers mes créations, je souhaite vous proposer des accessoires élégants, intemporels et accessibles,
                capables de révéler votre personnalité et d’apporter ce petit détail qui fait toute la différence.
            </p>
        </div>
    </section>

    <section class="values">
        <div>
            <h3>Fait main</h3>
            <p>Chaque pièce est unique.</p>
        </div>
        <div>
            <h3>Matières nobles</h3>
            <p>Sélection rigoureuse des matériaux.</p>
        </div>
        <div>
            <h3>Création française</h3>
            <p>Design & confection locale.</p>
        </div>
    </section>
</div>
<div class="shop-container">

    <?php foreach ($products as $product): ?>
        <?php 
            $images = $product['images'];
            $mainImage = $images[0]['image'] ?? 'default.jpg';
            $hoverImage = $images[1]['image'] ?? $mainImage; $images[2]['image'] ?? $mainImage;
        ?>

        <div class="product-card">

            <div class="product-image">
                <img 
                    src="<?= BASE_URL ?>uploads/<?= htmlspecialchars($mainImage) ?>" 
                    class="img-main"
                    alt="<?= htmlspecialchars($product['name']) ?>">

                <img 
                    src="<?= BASE_URL ?>uploads/<?= htmlspecialchars($hoverImage) ?>" 
                    class="img-hover"
                    alt="">
            </div>

            <div class="product-info">
                <h3><?= htmlspecialchars($product['name']) ?></h3>
                <p class="description"><?= htmlspecialchars($product['description']) ?></p>
                <p class="price"><?= number_format($product['price'], 2) ?> €</p>

                <a href="/cart/add/<?= $product['id'] ?>" class="add-to-cart">Ajouter au panier</a>
            </div>

        </div>
    <?php endforeach; ?>

</div>


<?php require __DIR__ . '/../layouts/footer.php'; ?>
