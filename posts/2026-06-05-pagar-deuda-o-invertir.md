---
title: "¿Pago mis deudas o empiezo a invertir?"
description: "Una guía con calculadoras para decidir si te conviene pagar deuda, invertir o guardar liquidez usando tasas, CETES y ejemplos aterrizados a México."
published_at: 2026-06-05
cover_path: img/posts/covers/deudas.png
cover_alt: "Nina sentada pensativamente junto a la palabra deudas y un mono de nieve."
tags: ['deudas', 'inversion', 'cetes', 'ahorro']
themes: ['deudas', 'inversion', 'ahorro']
newsletter_cta: true
---

<details open>
  <summary>
    Contenidos
  </summary>

  [[toc]]

</details>

Digamos que te sobran **$20,000 pesos**.

Puedes hacer dos cosas:

1. meterlos a CETES para sentir que por fin estás invirtiendo; o
2. usarlos para bajarle a una tarjeta que te cobra intereses cada mes.

La primera opción se siente más adulta. Más de “ahora sí estoy construyendo patrimonio”. La segunda se siente menos sexy, como limpiar el refri o cancelar una suscripción que ya ni usas.

Pero aquí viene la parte incómoda: **pagar una deuda cara puede ser la mejor inversión que tienes disponible**.

No porque sea inspirador. No porque “deudas malas, inversiones buenas”. Sino porque tu deuda no es una falla moral: **es una tasa de interés**.

Y si esa tasa es más alta que lo que razonablemente puedes ganar invirtiendo, la calculadora empieza a gritarte. Medio feo, pero con razón.

## La pregunta correcta

La pregunta no es:

> ¿Soy mala persona por tener deuda?

Tampoco es:

> ¿Estoy perdiendo mi juventud financiera si no invierto ya?

La pregunta más útil es:

> ¿Qué me conviene más con este dinero: evitar intereses, ganar rendimientos o comprar liquidez?

Para responder, hay que comparar cuatro cosas:

- la **tasa de tu deuda**;
- el **rendimiento neto esperado** de tu inversión;
- la **liquidez** que necesitas;
- y el **riesgo** que estás tomando.

Dicho sin tanta vuelta: si tu tarjeta te cobra 37% y CETES te paga 6%, no estás comparando dos inversiones. Estás comparando una fuga de agua contra una cubeta bonita.

Primero cierra la fuga.

<div data-pay-debt-invest>
  <section class="pd-tool full-width" data-debt-vs-investment aria-labelledby="calculadora-deuda-inversion">
    <h3 id="calculadora-deuda-inversion">Calculadora rápida: pagar deuda vs invertir</h3>
    <p>Juega con los números. Es una aproximación simple, no una declaración anual ni una recomendación personalizada.</p>

    <div class="pd-tool-grid">
      <div class="pd-tool-field">
        <label for="pdi-amount">Monto extra disponible</label>
        <input id="pdi-amount" data-field="amount" type="number" min="0" step="1000" value="20000">
      </div>
      <div class="pd-tool-field">
        <label for="pdi-debt-rate">Tasa anual de tu deuda</label>
        <input id="pdi-debt-rate" data-field="debt-rate" type="number" min="0" step="0.1" value="37.1">
      </div>
      <div class="pd-tool-field">
        <label for="pdi-investment-rate">Rendimiento anual esperado</label>
        <input id="pdi-investment-rate" data-field="investment-rate" type="number" min="0" step="0.1" value="6.36">
      </div>
      <div class="pd-tool-field">
        <label for="pdi-tax-rate">Retención / impuesto anual aproximado</label>
        <input id="pdi-tax-rate" data-field="tax-rate" type="number" min="0" step="0.1" value="0.9">
      </div>
      <div class="pd-tool-field">
        <label for="pdi-months">Horizonte en meses</label>
        <input id="pdi-months" data-field="months" type="number" min="1" max="120" step="1" value="12">
      </div>
      <label class="pd-tool-checkbox" for="pdi-emergency-fund">
        <input id="pdi-emergency-fund" data-field="has-emergency-fund" type="checkbox" checked>
        Ya tengo al menos un mini fondo de emergencia
      </label>
    </div>

    <div class="pd-tool-grid mt-4">
      <div class="pd-tool-result">
        <p class="pd-tool-result-label">Interés que evitas si pagas deuda</p>
        <p class="pd-tool-result-value" data-output="debt-interest">$0</p>
      </div>
      <div class="pd-tool-result">
        <p class="pd-tool-result-label">Rendimiento neto aproximado si inviertes</p>
        <p class="pd-tool-result-value" data-output="investment-gain">$0</p>
      </div>
      <div class="pd-tool-result">
        <p class="pd-tool-result-label">Brecha entre opciones</p>
        <p class="pd-tool-result-value" data-output="gap">$0</p>
      </div>
      <div class="pd-tool-result">
        <p class="pd-tool-result-label">Tasa neta usada para inversión</p>
        <p class="pd-tool-result-value" data-output="net-investment-rate">0%</p>
      </div>
    </div>

    <div class="pd-tool-bars" aria-hidden="true">
      <div class="pd-tool-bar-row">
        <span class="pd-tool-bar-label">Pagar deuda</span>
        <div class="pd-tool-bar-track"><div class="pd-tool-bar-fill pd-tool-bar-fill-danger" data-bar="debt"></div></div>
      </div>
      <div class="pd-tool-bar-row">
        <span class="pd-tool-bar-label">Invertir</span>
        <div class="pd-tool-bar-track"><div class="pd-tool-bar-fill" data-bar="investment"></div></div>
      </div>
    </div>

    <p class="pd-tool-note" data-output="decision"></p>
  </section>

## Ejemplo: tarjeta contra CETES

Con datos consultados el **5 de junio de 2026**, CETES a 1 mes estaba alrededor de **6.36%** anual. En reportes de Banco de México, la tasa efectiva promedio ponderada para clientela no-totalera de tarjeta de crédito era **37.1%** a junio de 2025.

Si tienes **$20,000 pesos** y comparas esas dos tasas de forma simple:

- pagar la tarjeta evita aproximadamente **$7,420 pesos** de intereses al año;
- meter ese dinero a CETES a 6.36% genera aproximadamente **$1,272 pesos brutos** al año;
- la diferencia es de más de **$6,000 pesos** a favor de pagar deuda.

O sea: invertir mientras arrastras esa tarjeta es como hacer dieta de lunes a viernes y echarte tres pasteles el sábado. No hay Excel que lo salve.

Claro, esto no significa que nunca debas invertir si tienes deuda. Significa que necesitas saber **cuánto cuesta esa deuda** antes de emocionarte con cualquier tasa de inversión.

## Pagar deuda es un rendimiento garantizado

Cuando pagas una deuda cara, no ganas intereses en una cuenta. Pero dejas de pagarlos.

Y eso importa.

Si pagas una deuda de $20,000 pesos al 37.1%, estás evitando alrededor de $7,420 pesos de intereses en un año. Eso se parece mucho a ganar $7,420 pesos, con una diferencia importante: no dependes de que el mercado suba, de que una SOFIPO mantenga promoción, ni de que tu portafolio “se recupere”.

Pagar una deuda cara es el CETE mamalón que ningún banco te va a vender: rendimiento alto y bastante garantizado, porque simplemente dejas de regalar intereses.

Pero ojo: la palabra importante es **cara**.

No es lo mismo una tarjeta al 52.7% que un crédito automotriz al 14.3%, una hipoteca con tasa fija o una deuda con penalización por prepago. Ahí la respuesta empieza a ponerse menos obvia. Y está bien. En finanzas personales, cuando alguien te promete una regla universal, normalmente te está vendiendo algo.

## El problema de quedarte en ceros

Ahora viene el “pero ojo” más importante del post.

Si usas todo tu dinero extra para pagar deuda y te quedas sin liquidez, el siguiente imprevisto puede regresar directo a la tarjeta.

¿Se ponchó una llanta? ¿Veterinario? ¿Deducible médico? ¿Laptop muerta justo cuando tienes chamba? La vida tiene una creatividad bien molesta para cobrarte cuando no tienes efectivo.

Por eso, antes de irte como héroe a liquidar todo, puede tener sentido separar un **mini fondo de emergencia**. No necesariamente seis meses de gastos desde el día uno. A veces basta empezar con un mes de gastos esenciales, o una cantidad que evite que cualquier cosa chiquita se convierta en deuda grande.

El fondo de emergencia es como un tanque de oxígeno. No te hace avanzar más rápido, pero evita que te ahogues.

  <section class="pd-tool full-width" data-emergency-bounce aria-labelledby="simulador-rebote">
    <h3 id="simulador-rebote">Simulador: el rebote de quedarte sin colchón</h3>
    <p>Prueba qué pasa si repartes tu dinero entre pagar deuda y dejar un mini fondo para el siguiente ladrillazo.</p>

    <div class="pd-tool-grid">
      <div class="pd-tool-field">
        <label for="bounce-extra-money">Dinero extra disponible</label>
        <input id="bounce-extra-money" data-field="extra-money" type="number" min="0" step="1000" value="20000">
      </div>
      <div class="pd-tool-field">
        <label for="bounce-emergency-cost">Costo del imprevisto</label>
        <input id="bounce-emergency-cost" data-field="emergency-cost" type="number" min="0" step="500" value="8000">
      </div>
      <div class="pd-tool-field">
        <label for="bounce-rate">Tasa anual si el imprevisto cae a tarjeta</label>
        <input id="bounce-rate" data-field="bounce-rate" type="number" min="0" step="0.1" value="52.7">
      </div>
      <div class="pd-tool-field">
        <label for="bounce-reserve-percent">Porcentaje que guardas como mini fondo: <span data-output="reserve-percent">0%</span></label>
        <input id="bounce-reserve-percent" data-field="reserve-percent" type="range" min="0" max="100" step="5" value="25">
      </div>
    </div>

    <div class="pd-tool-grid mt-4">
      <div class="pd-tool-result">
        <p class="pd-tool-result-label">Mini fondo</p>
        <p class="pd-tool-result-value" data-output="reserve">$0</p>
      </div>
      <div class="pd-tool-result">
        <p class="pd-tool-result-label">Pago inmediato a deuda</p>
        <p class="pd-tool-result-value" data-output="debt-payment">$0</p>
      </div>
      <div class="pd-tool-result">
        <p class="pd-tool-result-label">Nuevo saldo que rebota a tarjeta</p>
        <p class="pd-tool-result-value" data-output="new-debt">$0</p>
      </div>
      <div class="pd-tool-result">
        <p class="pd-tool-result-label">Costo anual de ese rebote</p>
        <p class="pd-tool-result-value" data-output="bounce-cost">$0</p>
      </div>
    </div>

    <div class="pd-tool-bars" aria-hidden="true">
      <div class="pd-tool-bar-row">
        <span class="pd-tool-bar-label">Mini fondo</span>
        <div class="pd-tool-bar-track"><div class="pd-tool-bar-fill" data-bar="reserve"></div></div>
      </div>
      <div class="pd-tool-bar-row">
        <span class="pd-tool-bar-label">Pago a deuda hoy</span>
        <div class="pd-tool-bar-track"><div class="pd-tool-bar-fill pd-tool-bar-fill-muted" data-bar="debt-payment"></div></div>
      </div>
      <div class="pd-tool-bar-row">
        <span class="pd-tool-bar-label">Deuda que rebota por emergencia</span>
        <div class="pd-tool-bar-track"><div class="pd-tool-bar-fill pd-tool-bar-fill-danger" data-bar="new-debt"></div></div>
      </div>
    </div>

    <p class="pd-tool-note" data-output="bounce-story"></p>
  </section>

## Entonces, ¿qué orden sigo?

Una regla práctica, imperfecta pero útil:

1. **Arma un mini fondo de emergencia.** Algo que te permita sobrevivir imprevistos chicos sin regresar a la tarjeta. Para empezar, piensa en un mes de gastos esenciales.
2. **Ataca deuda cara.** Tarjetas, créditos personales y cualquier cosa con tasa absurda.
3. **Construye tu fondo completo.** Tres a seis meses de gastos esenciales suele ser una referencia razonable, aunque depende de tu chamba, dependientes, salud, etc.
4. **Invierte para metas de mediano y largo plazo.** Aquí ya tiene más sentido pensar en CETES, BONDDIA, ETFs, AFORE, PPR o lo que toque según tu objetivo.

Esto no es una ley escrita por Moisés en una tabla de Banxico. Es una secuencia para no hacerte bolas.

## Avalancha o bola de nieve

Si ya decidiste atacar deuda, falta otra pregunta: **¿cuál pagas primero?**

Hay dos métodos famosos:

- **Avalancha:** pagar primero la deuda con mayor tasa. Matemáticamente suele ser lo mejor porque reduces los intereses más caros.
- **Bola de nieve:** pagar primero la deuda con menor saldo. Puede costar más, pero te da victorias rápidas y eso ayuda a no abandonar el plan.

La avalancha es el plan perfecto del nutriólogo. La bola de nieve es la rutina que sí haces.

Lo importante no es pelearte con desconocidos en internet sobre cuál método es más puro. Lo importante es calcular cuánto te cuesta elegir motivación sobre optimización.

  <section class="pd-tool full-width" data-payoff-game aria-labelledby="juego-avalancha-bola-nieve">
    <h3 id="juego-avalancha-bola-nieve">Juego: avalancha vs bola de nieve</h3>
    <p>Escenario fijo: Tarjeta A de $8,000 al 52.7%, crédito personal de $25,000 al 40.5% y auto de $150,000 al 14.3%. Cambia el pago extra mensual.</p>

    <div class="pd-tool-field">
      <label for="payoff-extra-payment">Pago extra mensual</label>
      <input id="payoff-extra-payment" data-field="extra-payment" type="number" min="0" step="500" value="3000">
    </div>

    <div class="pd-tool-grid mt-4">
      <div class="pd-tool-result">
        <p class="pd-tool-result-label">Avalancha: meses para liquidar</p>
        <p class="pd-tool-result-value" data-output="avalanche-months">0 meses</p>
        <p>Intereses aprox.: <strong data-output="avalanche-interest">$0</strong></p>
      </div>
      <div class="pd-tool-result">
        <p class="pd-tool-result-label">Bola de nieve: meses para liquidar</p>
        <p class="pd-tool-result-value" data-output="snowball-months">0 meses</p>
        <p>Intereses aprox.: <strong data-output="snowball-interest">$0</strong></p>
      </div>
      <div class="pd-tool-result">
        <p class="pd-tool-result-label">Costo de elegir motivación</p>
        <p class="pd-tool-result-value" data-output="motivation-cost">$0</p>
      </div>
    </div>

    <div class="pd-tool-bars" aria-hidden="true">
      <div class="pd-tool-bar-row">
        <span class="pd-tool-bar-label">Intereses con avalancha</span>
        <div class="pd-tool-bar-track"><div class="pd-tool-bar-fill" data-bar="avalanche"></div></div>
      </div>
      <div class="pd-tool-bar-row">
        <span class="pd-tool-bar-label">Intereses con bola de nieve</span>
        <div class="pd-tool-bar-track"><div class="pd-tool-bar-fill pd-tool-bar-fill-muted" data-bar="snowball"></div></div>
      </div>
    </div>

    <p class="pd-tool-note" data-output="payoff-summary"></p>
  </section>
</div>

## Casos donde sí puede tener sentido invertir mientras pagas deuda

No todo es “deuda primero y cállate”. Ojalá fuera así de fácil. No lo es.

Puede tener sentido combinar pago de deuda e inversión cuando:

- tu deuda tiene **tasa fija relativamente baja**;
- hay **penalización por prepago**;
- no tienes fondo de emergencia y pagar todo te deja vendido;
- existe un **beneficio fiscal o match laboral** que perderías si no aportas;
- tu inversión es realmente de largo plazo y la deuda no ahorca tu flujo mensual;
- estás comparando contra una deuda tipo hipoteca o auto, no contra una tarjeta al 50%.

Por ejemplo, un crédito automotriz promedio alrededor de 14.3% sigue siendo más caro que CETES a 7.16%, pero ya no es el mismo abuso que una tarjeta. Ahí vale la pena revisar contrato, seguros, penalizaciones, estabilidad de ingresos y si ese coche es herramienta de trabajo.

Depende. Ya sé, qué hueva. Pero “depende” es mejor que una regla simplona que te mete en problemas.

## Checklist antes de mover tu dinero

Antes de decidir, responde esto:

- ¿Cuál es la tasa real de mi deuda?
- ¿Estoy usando tasa, CAT o solo “lo que siento que pago”?
- ¿Mi inversión esperada supera esa tasa después de impuestos y riesgo?
- ¿Tengo al menos un mini fondo de emergencia?
- ¿Hay penalización por prepago?
- ¿Estoy eligiendo bola de nieve por motivación? ¿Cuánto me cuesta?
- ¿El dinero que quiero invertir es realmente de largo plazo?

Si no sabes la tasa de tu deuda, ese es el primer paso. No abrir otra app. No buscar “mejores ETFs 2026”. Primero saber qué tan grande es la fuga.

## Moraleja

Pagar deuda cara no se siente como invertir, pero muchas veces lo es.

Si una tarjeta te cobra 37%, 40% o 52%, no necesitas una inversión espectacular. Necesitas dejar de financiar al banco como si fueras su patrocinador oficial.

Mi orden favorito sería:

1. mini fondo para no rebotar;
2. deuda cara;
3. fondo de emergencia completo;
4. inversión según plazo y objetivo.

No porque sea perfecto. Porque es suficientemente simple para ejecutarlo.

Y en finanzas personales, un plan imperfecto que sí haces suele ganarle a un plan perfecto que solo vive en una pestaña de Google Sheets.

## Fuentes y notas

Datos consultados el **2026-06-05** o tomados de reportes institucionales recientes disponibles en esa fecha:

- Banco de México — indicadores y reportes: [banxico.org.mx](https://www.banxico.org.mx/)
- Cetesdirecto — tasas CETES: [cetesdirecto.com](https://www.cetesdirecto.com/tablas/valores_gubernamentales/cetes.html)
- Cetesdirecto — BONDDIA: [cetesdirecto.com](https://www.cetesdirecto.com/tablas/valores_gubernamentales/bonddia.html)
- INEGI — INPC: [inegi.org.mx](https://www.inegi.org.mx/temas/inpc/)
- Ley de Ingresos de la Federación 2026 — retención provisional ISR sobre intereses: [diputados.gob.mx](https://www.diputados.gob.mx/LeyesBiblio/pdf/LIF_2026.pdf)

Los cálculos del post son aproximaciones anuales simples para explicar la intuición. No incluyen todos los efectos de capitalización, comisiones, impuestos definitivos, promociones, seguros, penalizaciones ni particularidades de cada contrato. Úsalos para pensar mejor, no para apagar el cerebro.
