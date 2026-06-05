---
title: "CETES, BONDDIA o SOFIPOs: dónde estacionar tu dinero"
description: "Una guía práctica para decidir entre BONDDIA, CETES y SOFIPOs según plazo, liquidez, riesgo y protección, con simuladores para no elegir sólo por tasa."
published_at: 2026-06-05
cover_path: img/posts/covers/cetes.jpg
cover_alt: "La Nina esperando ansiosamente a que le lancemos el frisbee."
tags: ['cetes', 'bonddia', 'sofipos', 'ahorro', 'inversion']
themes: ['inversion', 'ahorro']
newsletter_cta: true
---

<details open>
  <summary>
    Contenidos
  </summary>

  [[toc]]

</details>

Tienes dinero guardado y quieres que deje de estar echado en la cuenta de nómina como perro en azotea.

Abres Cetesdirecto, ves BONDDIA, CETES a distintos plazos, luego alguien en internet menciona SOFIPOs con tasas más altas y de pronto la pregunta parece ser:

> ¿Cuál paga más?

Esa pregunta suena lógica, pero es incompleta.

La pregunta más útil es:

> ¿Cuándo necesito esta lana y qué estoy aceptando por perseguir más tasa?

Porque no todo tu dinero tiene el mismo trabajo. La renta del próximo mes, el viaje de diciembre y el enganche de una casa no se estacionan en el mismo lugar.

## La analogía del estacionamiento

Piénsalo como estacionar un coche.

Si vas a bajarte por cinco minutos, no lo metes a una pensión de largo plazo. Si te vas de viaje un año, tampoco lo dejas en doble fila con las intermitentes prendidas y una estampita de San Judas.

Con el dinero pasa algo parecido:

- **BONDDIA** es el valet de corto plazo: no suele ser el lugar más emocionante, pero puedes entrar y salir rápido.
- **CETES** es estacionamiento con boleto: eliges fecha de salida y aceptas que el dinero esté ocupado hasta entonces.
- **SOFIPOs** pueden ser una pensión que paga mejor, pero antes de dejar el coche revisas quién la opera, cuánto cubre el seguro y si puedes salir cuando quieres.

La tasa importa. Claro que importa. Pero la tasa no es el volante, los frenos y el seguro al mismo tiempo.

<div data-cash-parking>
  <section class="money-tool full-width" data-parking-selector aria-labelledby="parking-selector-title">
    <h3 id="parking-selector-title">Selector: ¿dónde estaciono esta lana?</h3>
    <p>Este selector no te da una recomendación personalizada; te ayuda a ordenar el trabajo que tiene ese dinero.</p>

    <div class="money-tool-grid">
      <div class="money-tool-field">
        <label for="parking-amount-input">Monto</label>
        <input id="parking-amount-input" data-field="parking-amount" type="number" min="0" step="1000" value="40000">
      </div>
      <div class="money-tool-field">
        <label for="parking-horizon-input">¿Cuándo lo necesitas?</label>
        <select id="parking-horizon-input" data-field="parking-horizon">
          <option value="now">Hoy / esta semana</option>
          <option value="one-three">1 a 3 meses</option>
          <option value="six-months" selected>3 a 12 meses</option>
          <option value="one-year-plus">Más de 12 meses</option>
        </select>
      </div>
      <div class="money-tool-field">
        <label for="parking-liquidity-input">¿Qué tanto dolería no poder retirarlo hoy? <span data-output="parking-amount">$40,000</span></label>
        <input id="parking-liquidity-input" data-field="parking-liquidity" type="range" min="1" max="10" step="1" value="7">
      </div>
      <div class="money-tool-field">
        <label for="parking-purpose-input">Uso principal</label>
        <select id="parking-purpose-input" data-field="parking-purpose">
          <option value="emergency">Fondo de emergencia</option>
          <option value="goal" selected>Meta con fecha</option>
          <option value="waiting">Dinero esperando decisión</option>
        </select>
      </div>
      <label class="money-tool-checkbox" for="parking-risk-input">
        <input id="parking-risk-input" data-field="parking-risk" type="checkbox">
        Acepto revisar riesgo de institución por más tasa
      </label>
    </div>

    <div class="money-tool-result mt-4">
      <p class="money-tool-kicker">Resultado</p>
      <p class="money-tool-value" data-output="parking-recommendation">CETES del plazo más cercano</p>
      <p data-output="parking-reason"></p>
    </div>

    <div class="money-bars" aria-hidden="true">
      <div class="money-bar-row">
        <span class="money-bar-label">Liquidez necesaria</span>
        <div class="money-bar-track"><div class="money-bar-fill" data-bar="parking-liquidity"></div></div>
      </div>
      <div class="money-bar-row">
        <span class="money-bar-label">Búsqueda de rendimiento</span>
        <div class="money-bar-track"><div class="money-bar-fill money-bar-fill-muted" data-bar="parking-yield"></div></div>
      </div>
      <div class="money-bar-row">
        <span class="money-bar-label">Riesgo que estás aceptando</span>
        <div class="money-bar-track"><div class="money-bar-fill money-bar-fill-warning" data-bar="parking-risk"></div></div>
      </div>
    </div>
  </section>

## BONDDIA: cuando la puerta de salida importa

BONDDIA puede servir para dinero que necesita estar disponible pronto: fondo de emergencia, renta del próximo mes, impuestos que ya sabes que vienen, lana que todavía no tiene destino.

No necesariamente gana la carrera de tasa. Ese no es su trabajo.

Su trabajo es tener puerta de emergencia.

Tu fondo de emergencia no está para ganar el concurso de rendimiento. Está para aparecer cuando la vida te avienta un ladrillazo: veterinario, deducible, llanta, laptop muerta, mudanza rara, lo que sea.

Meter ese dinero a un plazo largo sólo porque paga más puede ser como guardar el extinguidor dentro de una bodega cerrada con candado.

## CETES: cuando ya sabes la fecha de salida

CETES funciona mejor cuando el dinero tiene fecha más o menos clara.

Si necesitas $40,000 para un viaje en seis meses, tiene sentido mirar plazos que venzan cerca de esa fecha. No porque CETES sea perfecto, sino porque el instrumento empata con el calendario.

Aquí la clave es no enamorarte de un plazo por la tasa. Si tu lana vence después de la fecha en que la necesitas, ya no era “orden financiero”; era ganarle dos pesos al Excel mientras te metes un problema real.

Una forma simple de no bloquear todo igual es hacer una escalera: dividir el dinero en varios vencimientos.

  <section class="money-tool full-width" data-cetes-ladder aria-labelledby="cetes-ladder-title">
    <h3 id="cetes-ladder-title">Constructor: escalera simple de CETES</h3>
    <p>Divide un monto en varios plazos para que no todo venza el mismo día.</p>

    <div class="money-tool-grid">
      <div class="money-tool-field">
        <label for="ladder-amount-input">Monto total</label>
        <input id="ladder-amount-input" data-field="ladder-amount" type="number" min="0" step="1000" value="80000">
      </div>
      <div class="money-tool-field">
        <label for="ladder-steps-input">Escalones</label>
        <input id="ladder-steps-input" data-field="ladder-steps" type="number" min="1" max="4" step="1" value="4">
      </div>
      <div class="money-tool-field">
        <label for="ladder-rate-input">Tasa anual estimada</label>
        <input id="ladder-rate-input" data-field="ladder-rate" type="number" min="0" step="0.1" value="7.16">
      </div>
    </div>

    <div class="money-tool-grid mt-4">
      <div class="money-tool-result">
        <p class="money-tool-kicker">Monto por escalón</p>
        <p class="money-tool-value" data-output="ladder-per-step">$0</p>
      </div>
      <div class="money-tool-result">
        <p class="money-tool-kicker">Rendimiento bruto aproximado</p>
        <p class="money-tool-value" data-output="ladder-gross">$0</p>
      </div>
    </div>

    <div class="money-static-card mt-4">
      <p><strong>Vencimientos:</strong> <span data-output="ladder-cadence"></span></p>
      <ul data-output="ladder-list"></ul>
    </div>
  </section>

## SOFIPOs: más tasa, más tarea

Las SOFIPOs pueden pagar más que instrumentos gubernamentales. Eso llama la atención, obvio.

Pero una tasa más alta no viene envuelta en papel de regalo. Normalmente trae tarea:

- revisar si la tasa es promocional;
- revisar plazo y liquidez;
- revisar si pide membresía;
- revisar si aplica a todo el monto;
- revisar que la SOFIPO esté autorizada y cómo está de capitalización;
- revisar cuánto queda cubierto por el seguro.

No es “SOFIPOs malas”. Es “no son CETES con otro logo”.

### El paraguas de protección

La protección de 25,000 UDIS es útil, pero tiene tamaño. No es una nube mágica que cubre todo lo que metas.

Con valor UDI de ejemplo de **8.834391**, 25,000 UDIS equivalen a aproximadamente **$220,859.78 pesos** por persona por SOFIPO. Si metes más que eso en una sola institución, el excedente ya queda fuera del paraguas.

  <section class="money-tool full-width" data-sofipo-protection aria-labelledby="sofipo-protection-title">
    <h3 id="sofipo-protection-title">Simulador: paraguas SOFIPO</h3>
    <p>Calcula cuánto quedaría protegido y cuánto quedaría expuesto bajo el límite de 25,000 UDIS por SOFIPO.</p>

    <div class="money-tool-grid">
      <div class="money-tool-field">
        <label for="sofipo-amount-input">Monto a invertir</label>
        <input id="sofipo-amount-input" data-field="sofipo-amount" type="number" min="0" step="1000" value="250000">
      </div>
      <div class="money-tool-field">
        <label for="sofipo-count-input">Número de SOFIPOs</label>
        <input id="sofipo-count-input" data-field="sofipo-count" type="number" min="1" max="10" step="1" value="1">
      </div>
      <div class="money-tool-field">
        <label for="udi-value-input">Valor UDI usado</label>
        <input id="udi-value-input" data-field="udi-value" type="number" min="0" step="0.000001" value="8.834391">
      </div>
    </div>

    <div class="money-tool-grid mt-4">
      <div class="money-tool-result">
        <p class="money-tool-kicker">Protección por SOFIPO</p>
        <p class="money-tool-value" data-output="per-sofipo">$0</p>
      </div>
      <div class="money-tool-result">
        <p class="money-tool-kicker">Cobertura total aproximada</p>
        <p class="money-tool-value" data-output="total-covered">$0</p>
      </div>
      <div class="money-tool-result">
        <p class="money-tool-kicker">Monto protegido</p>
        <p class="money-tool-value" data-output="protected-amount">$0</p>
      </div>
      <div class="money-tool-result">
        <p class="money-tool-kicker">Monto expuesto</p>
        <p class="money-tool-value" data-output="exposed-amount">$0</p>
      </div>
    </div>

    <div class="money-bars" aria-hidden="true">
      <div class="money-bar-row">
        <span class="money-bar-label">Debajo del paraguas</span>
        <div class="money-bar-track"><div class="money-bar-fill" data-bar="protected"></div></div>
      </div>
      <div class="money-bar-row">
        <span class="money-bar-label">Fuera del paraguas</span>
        <div class="money-bar-track"><div class="money-bar-fill money-bar-fill-warning" data-bar="exposed"></div></div>
      </div>
    </div>

    <p class="money-tool-note" data-output="protection-story"></p>
  </section>
</div>

## La tasa más alta no siempre gana

Una tasa de 13% o 15% jala la mirada como anuncio de taquería a medianoche.

Pero el letrero no te dice todo:

<div class="money-pill-list">
  <span>liquidez</span>
  <span>plazo</span>
  <span>riesgo</span>
  <span>protección</span>
  <span>impuestos</span>
  <span>promoción</span>
  <span>membresía</span>
</div>

Si la tasa alta aplica sólo a cierto monto, por cierto plazo, con cierta membresía, y además bloquea el dinero que necesitas en tres semanas, la tasa real de tu vida puede ser menor que la tasa del anuncio.

Por eso me gusta separar el dinero por trabajo:

- **Fondo de emergencia:** liquidez primero.
- **Meta con fecha clara:** plazo que venza antes de la fecha.
- **Dinero que no necesitas pronto:** ya puedes comparar más tasa, pero también más riesgo.
- **Largo plazo real:** quizá ya no estás hablando de BONDDIA/CETES/SOFIPOs, sino de portafolio.

## Checklist antes de mover tu lana

Antes de escoger, revisa:

- ¿Cuándo necesito este dinero?
- ¿Qué pasa si lo necesito antes?
- ¿La tasa es bruta, neta, promocional o condicionada?
- ¿Hay límite por monto?
- ¿Hay membresía, comisión o letra chiquita?
- ¿Estoy rebasando protección por SOFIPO?
- ¿Estoy usando dinero de emergencia para perseguir tasa?
- ¿Estoy comparando riesgo de gobierno contra riesgo de institución como si fueran iguales?

## Moraleja

No todo tu dinero necesita la tasa más alta. Necesita el plazo correcto.

BONDDIA, CETES y SOFIPOs no son versiones intercambiables de “algo que paga intereses”. Son herramientas para trabajos distintos.

Si entiendes cuándo necesitas la lana, cuánto puedes bloquear y qué riesgo aceptas, la decisión se vuelve menos sexy, pero más útil.

Y en finanzas personales, “menos sexy pero más útil” suele ser una gran victoria.

## Fuentes y notas

Datos consultados el **2026-06-05** o tomados de referencias institucionales disponibles en esa fecha:

- Cetesdirecto — CETES y BONDDIA: [cetesdirecto.com](https://www.cetesdirecto.com/)
- Banco de México — indicadores y valores gubernamentales: [banxico.org.mx](https://www.banxico.org.mx/)
- CONDUSEF / sector SOFIPO: [condusef.gob.mx](https://www.condusef.gob.mx/)
- Valor UDI usado en ejemplos: 8.834391.

Los cálculos son aproximaciones didácticas. No sustituyen revisar contrato, plazos, impuestos, comisiones, autorizaciones, capitalización de la institución ni condiciones comerciales vigentes.
