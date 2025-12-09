// document.addEventListener("DOMContentLoaded", () => {
//     const username = localStorage.getItem("username");
//     if (!username) {
//         window.location.href = "../login/login.html";
//         return;
//     }
//     document.getElementById("welcomeMsg").textContent = `Welcome back, ${username}!`;

//     const budgetForm = document.getElementById("budgetForm");
//     const budgetInput = document.getElementById("budgetInput");
//     const totalBudget = document.getElementById("totalBudget");
//     const totalSpent = document.getElementById("totalSpent");
//     const remaining = document.getElementById("remaining");
//     const progressFill = document.getElementById("progressFill");
//     const expenseForm = document.getElementById("expenseForm");
//     const expenseName = document.getElementById("expenseName");
//     const expenseAmount = document.getElementById("expenseAmount");
//     const expenseCategory = document.getElementById("expenseCategory");
//     const expenseDate = document.getElementById("expenseDate");
//     const historyBody = document.getElementById("historyBody");
//     const logoutBtn = document.getElementById("logoutBtn");

//     const editModal = document.getElementById("editModal");
//     const editForm = document.getElementById("editForm");
//     const editName = document.getElementById("editName");
//     const editAmount = document.getElementById("editAmount");
//     const editCategory = document.getElementById("editCategory");
//     const cancelEdit = document.getElementById("cancelEdit");

//     const apiUrl = "http://localhost:5000/api/expenses";
//     let budget = 0;
//     let expenses = [];
//     let editId = null;

//     // Fetch all expenses for logged-in user
//     async function loadExpenses() {
//         try {
//             const res = await fetch(`${apiUrl}/${username}`);
//             expenses = await res.json();
//             renderTable();
//             updateSummary();
//             updateChart();
//         } catch (error) {
//             console.error("Error loading expenses:", error);
//         }
//     }

//     // Add new expense
//     expenseForm.addEventListener("submit", async (e) => {
//         e.preventDefault();

//         const name = expenseName.value.trim();
//         const amount = parseFloat(expenseAmount.value);
//         const category = expenseCategory.value;
//         const date = expenseDate.value || new Date().toISOString().split("T")[0];

//         if (!name || !amount || !category) {
//             alert("Please fill all fields!");
//             return;
//         }

//         const expense = { name, amount, category, date, username };

//         await fetch(apiUrl, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(expense),
//         });

//         expenseName.value = "";
//         expenseAmount.value = "";
//         expenseCategory.value = "";
//         expenseDate.value = "";
//         await loadExpenses();
//     });

//     // Render table (Corrected Date Format)
//     function renderTable() {
//         historyBody.innerHTML = "";

//         expenses.forEach((exp) => {
//             // Fix date format to DD-MM-YYYY
//             let dateStr = exp.date;
//             let formattedDate = "";

//             if (dateStr) {
//                 const d = new Date(dateStr);
//                 formattedDate = d.toLocaleDateString("en-IN", {
//                     day: "2-digit",
//                     month: "2-digit",
//                     year: "numeric"
//                 });
//             }

//             const row = document.createElement("tr");
//             row.innerHTML = `
//         <td>${exp.name}</td>
//         <td>₹${exp.amount}</td>
//         <td>${exp.category}</td>
//         <td>${formattedDate}</td>
//         <td>
//           <button class="edit-btn" data-id="${exp.id}">✏️</button>
//           <button class="delete-btn" data-id="${exp.id}">🗑️</button>
//         </td>
//       `;
//             historyBody.appendChild(row);
//         });
//     }


//     // Delete and edit
//     historyBody.addEventListener("click", async (e) => {
//         const id = e.target.getAttribute("data-id");

//         if (e.target.classList.contains("delete-btn")) {
//             await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
//             await loadExpenses();
//         }

//         if (e.target.classList.contains("edit-btn")) {
//             const exp = expenses.find((x) => x.id == id);
//             if (exp) {
//                 editId = id;
//                 editName.value = exp.name;
//                 editAmount.value = exp.amount;
//                 editCategory.value = exp.category;
//                 editModal.style.display = "flex";
//             }
//         }
//     });

//     editForm.addEventListener("submit", async (e) => {
//         e.preventDefault();
//         const exp = {
//             name: editName.value,
//             amount: parseFloat(editAmount.value),
//             category: editCategory.value,
//         };

//         await fetch(`${apiUrl}/${editId}`, {
//             method: "PUT",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(exp),
//         });

//         editModal.style.display = "none";
//         await loadExpenses();
//     });

//     cancelEdit.addEventListener("click", () => (editModal.style.display = "none"));

//     // Update budget
//     budgetForm.addEventListener("submit", (e) => {
//         e.preventDefault();
//         budget = parseFloat(budgetInput.value);
//         updateSummary();
//         budgetInput.value = "";
//     });

//     function updateSummary() {
//         const total = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
//         totalBudget.textContent = `₹${budget}`;
//         totalSpent.textContent = `₹${total}`;
//         remaining.textContent = `₹${budget - total}`;
//         const percent = budget ? Math.min((total / budget) * 100, 100) : 0;
//         progressFill.style.width = `${percent}%`;
//     }

//     // Chart
//     const ctx = document.getElementById("expenseChart").getContext("2d");
//     let expenseChart = new Chart(ctx, {
//         type: "pie",
//         data: { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
//         options: { responsive: true, maintainAspectRatio: false },
//     });

//     function updateChart() {
//         const categoryTotals = {};
//         expenses.forEach((exp) => {
//             categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + parseFloat(exp.amount);
//         });

//         expenseChart.data.labels = Object.keys(categoryTotals);
//         expenseChart.data.datasets[0].data = Object.values(categoryTotals);
//         expenseChart.data.datasets[0].backgroundColor = [
//             "#007bff",
//             "#33a1fd",
//             "#5cbef2",
//             "#47a6ff",
//             "#00c4ff",
//             "#339cff",
//             "#6aa9ff",
//             "#9ecfff",
//             "#c8e3ff",
//         ];
//         expenseChart.update();
//     }

//     logoutBtn.addEventListener("click", () => {
//         localStorage.removeItem("username");
//         window.location.href = "../login/login.html";
//     });

//     // Initialize
//     loadExpenses();
// });
document.addEventListener("DOMContentLoaded", () => {

    // Get logged in user
    const username = localStorage.getItem("username");
    if (!username) {
        window.location.href = "../login/login.html";
        return;
    }
    document.getElementById("welcomeMsg").textContent = `Welcome back, ${username}!`;

    // All DOM elements
    const budgetForm = document.getElementById("budgetForm");
    const budgetInput = document.getElementById("budgetInput");
    const totalBudget = document.getElementById("totalBudget");
    const totalSpent = document.getElementById("totalSpent");
    const remaining = document.getElementById("remaining");
    const progressFill = document.getElementById("progressFill");
    const expenseForm = document.getElementById("expenseForm");
    const expenseName = document.getElementById("expenseName");
    const expenseAmount = document.getElementById("expenseAmount");
    const expenseCategory = document.getElementById("expenseCategory");
    const expenseDate = document.getElementById("expenseDate");
    const historyBody = document.getElementById("historyBody");
    const logoutBtn = document.getElementById("logoutBtn");

    const editModal = document.getElementById("editModal");
    const editForm = document.getElementById("editForm");
    const editName = document.getElementById("editName");
    const editAmount = document.getElementById("editAmount");
    const editCategory = document.getElementById("editCategory");
    const cancelEdit = document.getElementById("cancelEdit");

    // Backend API URLs
    const apiUrl = "http://localhost:5000/api/expenses";
    const budgetApiUrl = "http://localhost:5000/api/budget";

    let budget = 0;
    let expenses = [];
    let editId = null;

    // ======================== LOAD BUDGET =========================
    async function loadBudget() {
        try {
            const res = await fetch(`${budgetApiUrl}/${username}`);
            const data = await res.json();
            budget = parseFloat(data.budget) || 0;
            updateSummary();
        } catch (err) {
            console.error("Error loading budget:", err);
        }
    }

    // ======================== SAVE BUDGET =========================
    budgetForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const value = parseFloat(budgetInput.value);

        if (isNaN(value)) {
            alert("Please enter a valid number");
            return;
        }
        budget = value;

        try {
            await fetch(budgetApiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, budget })
            });
            updateSummary();
            budgetInput.value = "";
        } catch (err) {
            console.error("Error saving budget:", err);
            alert("Could not save budget. Check server.");
        }
    });

    // ======================== LOAD EXPENSES =========================
    async function loadExpenses() {
        try {
            const res = await fetch(`${apiUrl}/${username}`);
            expenses = await res.json();
            renderTable();
            updateSummary();
            updateChart();
        } catch (error) {
            console.error("Error loading expenses:", error);
        }
    }

    // ======================== ADD NEW EXPENSE =========================
    expenseForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = expenseName.value.trim();
        const amount = parseFloat(expenseAmount.value);
        const category = expenseCategory.value;
        const date = expenseDate.value || new Date().toISOString().split("T")[0];

        if (!name || !amount || !category) {
            alert("Please fill all fields!");
            return;
        }

        const expense = { name, amount, category, date, username };

        await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(expense),
        });

        expenseName.value = "";
        expenseAmount.value = "";
        expenseCategory.value = "";
        expenseDate.value = "";
        await loadExpenses();
    });

    // ======================== RENDER TABLE WITH DATE FIX =========================
    function renderTable() {
        historyBody.innerHTML = "";
        expenses.forEach((exp) => {

            // Convert date to DD-MM-YYYY
            let formattedDate = "";
            if (exp.date) {
                const d = new Date(exp.date);
                formattedDate = d.toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                });
            }

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${exp.name}</td>
                <td>₹${exp.amount}</td>
                <td>${exp.category}</td>
                <td>${formattedDate}</td>
                <td>
                    <button class="edit-btn" data-id="${exp.id}">✏️</button>
                    <button class="delete-btn" data-id="${exp.id}">🗑️</button>
                </td>
            `;
            historyBody.appendChild(row);
        });
    }

    // ======================== DELETE & EDIT =========================
    historyBody.addEventListener("click", async (e) => {
        const id = e.target.getAttribute("data-id");

        if (e.target.classList.contains("delete-btn")) {
            await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
            await loadExpenses();
        }

        if (e.target.classList.contains("edit-btn")) {
            const exp = expenses.find((x) => x.id == id);
            if (exp) {
                editId = id;
                editName.value = exp.name;
                editAmount.value = exp.amount;
                editCategory.value = exp.category;
                editModal.style.display = "flex";
            }
        }
    });

    editForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const exp = {
            name: editName.value,
            amount: parseFloat(editAmount.value),
            category: editCategory.value,
        };

        await fetch(`${apiUrl}/${editId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(exp),
        });

        editModal.style.display = "none";
        await loadExpenses();
    });

    cancelEdit.addEventListener("click", () => (editModal.style.display = "none"));

    // ======================== UPDATE SUMMARY (Budget UI) =========================
    function updateSummary() {
        const total = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
        totalBudget.textContent = `₹${budget}`;
        totalSpent.textContent = `₹${total}`;
        remaining.textContent = `₹${budget - total}`;
        const percent = budget ? Math.min((total / budget) * 100, 100) : 0;
        progressFill.style.width = `${percent}%`;
    }

    // ======================== CHART =========================
    const ctx = document.getElementById("expenseChart").getContext("2d");
    let expenseChart = new Chart(ctx, {
        type: "pie",
        data: { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
        options: { responsive: true, maintainAspectRatio: false },
    });

    function updateChart() {
        const categoryTotals = {};
        expenses.forEach((exp) => {
            categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + parseFloat(exp.amount);
        });

        expenseChart.data.labels = Object.keys(categoryTotals);
        expenseChart.data.datasets[0].data = Object.values(categoryTotals);
        expenseChart.data.datasets[0].backgroundColor = [
            "#007bff", "#33a1fd", "#5cbef2", "#47a6ff",
            "#00c4ff", "#339cff", "#6aa9ff", "#9ecfff", "#c8e3ff",
        ];
        expenseChart.update();
    }

    // ======================== LOGOUT =========================
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("username");
        window.location.href = "../login/login.html";
    });

    // ======================== INITIAL CALLS =========================
    loadBudget().finally(() => {
        loadExpenses();
    });
});
