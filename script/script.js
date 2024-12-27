let years = [];
let prices = [];
let chart = null;

// Fungsi untuk menambah data dari input pengguna
function addData() {
    const yearInput = document.getElementById('year');
    const priceInput = document.getElementById('price');

    const year = parseInt(yearInput.value);
    const price = parseFloat(priceInput.value);

    if (!year || !price) {
        alert("Masukkan data yang valid!");
        return;
    }

    years.push(year);
    prices.push(price);

    // Kosongkan input setelah data ditambahkan
    yearInput.value = '';
    priceInput.value = '';

    // Update tampilan data
    displayData();

    // Update chart
    updateChart();
}

// Menampilkan data yang sudah dimasukkan dalam tabel
function displayData() {
    const predictionsList = document.getElementById('predictions-list');
    predictionsList.innerHTML = ''; // Reset list sebelum menambahkan data

    years.forEach((year, index) => {
        const li = document.createElement('tr');
        li.innerHTML = `<td class="border px-4 py-2">${year}</td><td class="border px-4 py-2">${prices[index]}</td>`;
        predictionsList.appendChild(li);
    });
}

// Kalkulasi dan tampilkan prediksi untuk 4 tahun mendatang
function finishInput() {
    // Prediksi untuk 4 tahun mendatang
    const futureYears = [years[years.length - 1] + 1, years[years.length - 1] + 2, years[years.length - 1] + 3, years[years.length - 1] + 4];
    const futurePrices = predictPrices(futureYears);

    // Menambahkan hasil prediksi ke dalam tabel
    const predictionsList = document.getElementById('predictions-list');
    futureYears.forEach((year, index) => {
        const li = document.createElement('tr');
        li.innerHTML = `<td class="border px-4 py-2">${year}</td><td class="border px-4 py-2">${futurePrices[index]}</td>`;
        predictionsList.appendChild(li);
    });

    // Update chart
    updateChart(futureYears, futurePrices);
}

// Fungsi untuk menghitung harga prediksi berdasarkan regresi linier
function predictPrices(futureYears) {
    const X = years.map(year => [year]);
    const y = prices;

    // Linear Regression
    const regression = linearRegression(X, y);

    return futureYears.map(year => regression.m * year + regression.b);
}

// Fungsi untuk menghitung koefisien regresi linier (m dan b)
function linearRegression(X, y) {
    const n = X.length;
    const meanX = X.reduce((sum, x) => sum + x[0], 0) / n;
    const meanY = y.reduce((sum, yVal) => sum + yVal, 0) / n;

    const numerator = X.reduce((sum, x, i) => sum + (x[0] - meanX) * (y[i] - meanY), 0);
    const denominator = X.reduce((sum, x) => sum + Math.pow(x[0] - meanX, 2), 0);

    const m = numerator / denominator;
    const b = meanY - m * meanX;

    return { m, b };
}

// Update chart untuk data historis dan prediksi
function updateChart(futureYears = [], futurePrices = []) {
    const ctx = document.getElementById('priceChart').getContext('2d');

    // Gabungkan data historis dengan data prediksi
    const allYears = years.concat(futureYears); // Gabungkan tahun historis dan prediksi
    const allPrices = prices.concat(futurePrices); // Gabungkan harga historis dan prediksi

    // Jika chart sudah ada, hanya update data, tidak perlu dihancurkan
    if (chart) {
        chart.data.labels = allYears; // Gabungkan tahun historis dan prediksi untuk label
        chart.data.datasets[0].data = prices; // Data historis tetap pada dataset pertama
        chart.data.datasets[1].data = allPrices; // Gabungkan harga historis dan prediksi pada dataset kedua
        chart.update(); // Hanya memperbarui chart
    } else {
        // Membuat chart pertama kali jika belum ada
        chart = new Chart(ctx, {
            type: 'line', // Jenis chart yang digunakan (garis)
            data: {
                labels: allYears, // Gabungkan tahun historis dan prediksi untuk label
                datasets: [
                    {
                        label: 'Harga Bahan Pokok',
                        data: prices, // Hanya data historis untuk dataset pertama
                        borderColor: 'rgb(75, 192, 192)', // Warna hijau untuk data historis
                        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Transparan untuk area di bawah garis
                        fill: false,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        borderWidth: 2
                    },
                    {
                        label: 'Prediksi Harga',
                        data: allPrices, // Gabungkan harga historis dan prediksi untuk dataset kedua
                        borderColor: 'rgb(255, 99, 132)', // Ubah warna untuk prediksi menjadi merah
                        backgroundColor: 'rgba(255, 99, 132, 0.2)', // Transparan untuk area di bawah garis
                        fill: false,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Tahun'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Harga (ribuan rupiah)'
                        }
                    }
                }
            }
        });
    }
}


// Inisialisasi chart pertama kali
updateChart();
