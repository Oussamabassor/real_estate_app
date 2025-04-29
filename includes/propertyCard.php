<div class="card-footer d-flex justify-content-between">
    <span class="price"><?php echo '$' . number_format($property['price']); ?></span>
    <a href="contact.php?property_id=<?php echo $property['id']; ?>&property_name=<?php echo urlencode($property['name']); ?>" class="btn btn-primary reserve-btn">Reserve</a>
</div>