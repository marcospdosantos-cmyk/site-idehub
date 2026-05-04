<?php

$coupon = $coupon ?? [
    'code' => '',
    'description' => '',
    'discount_type' => 'percent',
    'discount_value' => '',
    'min_order_total' => '',
    'usage_limit' => '',
    'starts_at' => '',
    'ends_at' => '',
    'active' => 1,
];
?>
<div class="grid grid-2">
    <div class="form-row">
        <label>Código</label>
        <input name="code" required maxlength="60" placeholder="IDE10" value="<?= e($coupon['code']) ?>">
        <p class="field-hint">Sem espaços. O sistema salva em letras maiúsculas.</p>
    </div>
    <div class="form-row">
        <label>Tipo de desconto</label>
        <select name="discount_type">
            <option value="percent" <?= $coupon['discount_type'] === 'percent' ? 'selected' : '' ?>>Porcentagem</option>
            <option value="fixed" <?= $coupon['discount_type'] === 'fixed' ? 'selected' : '' ?>>Valor fixo</option>
        </select>
    </div>
</div>
<div class="grid grid-2">
    <div class="form-row">
        <label>Valor do desconto</label>
        <input name="discount_value" required value="<?= e((string) $coupon['discount_value']) ?>" placeholder="10 ou 25,00">
    </div>
    <div class="form-row">
        <label>Pedido mínimo</label>
        <input name="min_order_total" value="<?= e((string) $coupon['min_order_total']) ?>" placeholder="0,00">
    </div>
</div>
<div class="grid grid-2">
    <div class="form-row">
        <label>Limite de uso</label>
        <input type="number" min="0" name="usage_limit" value="<?= e((string) ($coupon['usage_limit'] ?? '')) ?>" placeholder="Sem limite">
    </div>
    <div class="form-row">
        <label>Status</label>
        <select name="active">
            <option value="1" <?= (int) $coupon['active'] === 1 ? 'selected' : '' ?>>Ativo</option>
            <option value="0" <?= (int) $coupon['active'] === 0 ? 'selected' : '' ?>>Inativo</option>
        </select>
    </div>
</div>
<div class="grid grid-2">
    <div class="form-row">
        <label>Começa em</label>
        <input type="datetime-local" name="starts_at" value="<?= e($coupon['starts_at'] ? date('Y-m-d\TH:i', strtotime((string) $coupon['starts_at'])) : '') ?>">
    </div>
    <div class="form-row">
        <label>Termina em</label>
        <input type="datetime-local" name="ends_at" value="<?= e($coupon['ends_at'] ? date('Y-m-d\TH:i', strtotime((string) $coupon['ends_at'])) : '') ?>">
    </div>
</div>
<div class="form-row">
    <label>Descrição interna</label>
    <textarea name="description" placeholder="Ex.: campanha de lançamento"><?= e($coupon['description']) ?></textarea>
</div>
