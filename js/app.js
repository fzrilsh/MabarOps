

function toast(msg, type) {
  var el = document.createElement('div');
  el.className = 'toast toast-' + (type || 'success');
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(function() {
    el.style.opacity = '0';
    el.style.transform = 'translateY(-12px)';
    el.style.transition = 'all 0.25s';
  }, 2200);
  setTimeout(function() { el.remove(); }, 2600);
}

function copyText(t) {
  navigator.clipboard.writeText(t).then(function() { toast('Disalin!', 'success'); });
}

function initStars(id) {
  var c = document.getElementById(id);
  if (!c) return;
  var spans = c.querySelectorAll('span');
  for (var i = 0; i < spans.length; i++) {
    (function(idx) {
      spans[i].onclick = function() {
        for (var j = 0; j < spans.length; j++) {
          spans[j].classList.toggle('on', j <= idx);
        }
      };
    })(i);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  var toggles = document.querySelectorAll('.toggle input');
  for (var i = 0; i < toggles.length; i++) {
    toggles[i].addEventListener('change', function() {
      var g = this.closest('[data-toggle-group]');
      if (g) {
        var t = g.querySelector('[data-toggle-text]');
        if (t) t.textContent = this.checked ? 'Aktif' : 'Nonaktif';
      }
    });
  }
});

function addPriceType() {
  var name = document.getElementById('newPriceName');
  var price = document.getElementById('newPriceAmount');
  var priority = document.getElementById('newPricePriority');

  if (!name.value.trim() || !price.value.trim() || !priority.value.trim()) {
    toast('Isi semua field harga!', 'warning');
    return;
  }

  var container = document.getElementById('priceList');
  var item = document.createElement('div');
  item.className = 'queue-row';
  item.style.cursor = 'default';
  item.innerHTML =
    '<div style="display:flex;align-items:center;gap:8px;flex:1;flex-wrap:wrap;">' +
      '<span class="badge" style="background:' + (priority.value === '1' ? 'rgb(245 197 24 / 0.12);color:#F5C518' : priority.value === '2' ? 'rgb(139 92 246 / 0.12);color:#8B5CF6' : 'rgb(0 212 255 / 0.12);color:#00D4FF') + ';border:1px solid;flex-shrink:0;">' +
        (priority.value === '1' ? 'Tertinggi' : priority.value === '2' ? 'Sedang' : 'Rendah') +
      '</span>' +
      '<span style="font-size:14px;font-weight:600;">' + name.value.trim() + '</span>' +
      '<span style="font-size:12px;color:var(--text3);">Rp ' + Number(price.value).toLocaleString() + '</span>' +
    '</div>' +
    '<button class="btn btn-sm btn-danger" onclick="this.closest(\'.queue-row\').remove();calcRoyalty();">Hapus</button>';

  container.appendChild(item);

  name.value = '';
  price.value = '';
  priority.value = '2';
  calcRoyalty();
  toast('Tipe harga ditambahkan!', 'success');
}

function calcRoyalty() {
  var total = 0;
  var prices = document.querySelectorAll('#priceList .queue-row');
  for (var i = 0; i < prices.length; i++) {
    var txt = prices[i].innerText;
    var match = txt.match(/Rp\s*([\d,]+)/);
    if (match) {
      total += parseInt(match[1].replace(/,/g, ''));
    }
  }
  
  var estRevenue = total * 12; 
  var fee = Math.round(estRevenue * 0.1);
  var el = document.getElementById('royaltyDisplay');
  if (el) el.textContent = 'Rp ' + fee.toLocaleString();
}

function moveQueueItem(btn, direction) {
  var row = btn.closest('.queue-row');
  if (!row) return;
  var container = row.closest('[data-queue]');
  if (!container) return;

  var sibling = direction === 'up' ? row.previousElementSibling : row.nextElementSibling;
  if (!sibling || !sibling.classList.contains('queue-row')) {
    toast('Sudah di posisi ' + (direction === 'up' ? 'paling atas' : 'paling bawah'), 'warning');
    return;
  }

  if (direction === 'up') {
    sibling.parentNode.insertBefore(row, sibling);
  } else {
    sibling.parentNode.insertBefore(sibling, row);
  }

  toast('Antrean diurutkan ulang!', 'success');
}

function renumberQueue(container) {
  var allItems = container.querySelectorAll('.queue-row');
  for (var j = 0; j < allItems.length; j++) {
    allItems[j].setAttribute('data-pos', j + 1);
  }
}

function publishRoomCode(inputId) {
  var input = document.getElementById(inputId);
  if (!input) return;
  var code = input.value.trim();
  if (code.length < 4) { toast('Room code minimal 4 digit', 'warning'); return; }
  var displays = document.querySelectorAll('.room-code-display');
  for (var i = 0; i < displays.length; i++) displays[i].textContent = code;
  toast('Room Code ' + code + ' dipublikasikan!', 'success');
  input.value = '';
}
