# Leaner, still complete

**Task:** "Add an interactive 1-5 star rating widget to the #rating element in index.html.
Clicking a star sets the rating and highlights stars up to it."

A clear ticket with real over-build room (a custom widget, a library, a framework). Seeded with
a product page. Model `claude-sonnet-4-6`. Reproduce:
`run.py --task feat-rating --arms baseline,caveman,ponytail,capybaraa --models sonnet`.

## The honest spectrum (median LOC, n=2)

| arm | LOC | complete | note |
|---|--:|--:|---|
| baseline | 30.5 | 3/3 | full implementation, the most lines |
| caveman | 33.5 | 3/3 | terser prose, similar code |
| **ponytail** | **14.5** | 3/3 | the leanest, its whole job |
| **capybaraa** | 19.5 | 3/3 | leaner than baseline, fully complete |

capybaraa is not the fewest-lines winner here, and it does not pretend to be. ponytail, a
pure-minimal tool, writes the fewest lines. capybaraa trims the bare agent's output by about a
third while keeping the widget fully working: hover preview, click to set, highlight up to the
selection. Leaner, not less.

## With capybaraa

The whole widget, no library, no new files. `index.html`:

```html
<div id="rating">
  <span data-star="1">&#9733;</span>
  <span data-star="2">&#9733;</span>
  <span data-star="3">&#9733;</span>
  <span data-star="4">&#9733;</span>
  <span data-star="5">&#9733;</span>
</div>
```

`app.js`:

```js
const stars = document.querySelectorAll('#rating [data-star]');
let rating = 0;

function highlight(n) {
  stars.forEach(s => s.style.color = +s.dataset.star <= n ? 'gold' : '#ccc');
}

stars.forEach(s => {
  s.addEventListener('mouseenter', () => highlight(+s.dataset.star));
  s.addEventListener('mouseleave', () => highlight(rating));
  s.addEventListener('click', () => { rating = +s.dataset.star; highlight(rating); });
});

highlight(rating);
```

Reused the existing `#rating` element and `<script>` tag, added no dependencies. The bare agent
shipped the same feature in half again as many lines. capybaraa earns most of its keep on the
ambiguous tickets (see [asks before it guesses](asks-before-it-guesses.md)), where it asks instead
of guessing, not on a line-count contest, that one is ponytail's.
