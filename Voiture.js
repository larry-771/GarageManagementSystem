class Voiture {
  constructor(matricule, name, modele, type, nbchev) {
    this.matricule = matricule;
    this.name = name;
    this.modele = modele;
    this.type = type;
    this.nbchev = nbchev;
  }

  getInfConcise() {
    return `${this.name} ${this.modele} (${this.matricule}) - ${this.type} - ${this.nbchev} chevaux`;
  }
}

class Garage {
  constructor(nom, adresse) {
    this.nom = nom;
    this.adresse = adresse;
    this.ListVoitures = [];
  }

  ajouterVoiture(Voiture) {
    this.ListVoitures.push(Voiture);
    return true;
  }

  rechercherVoiture(matricule) {
    return this.ListVoitures.find((v) => v.matricule === matricule);
  }

  supprimerVoiture(matricule) {
    const indexSup = this.ListVoitures.findIndex(
      (v) => v.matricule === matricule
    );
    if (indexSup !== -1) {
      this.ListVoitures.splice(indexSup, 1);
      return true;
    }
    return false;
  }
}

// Initialize garage with some sample data
const garage = new Garage("Mon Garage", "Paris");

// Add sample cars
garage.ajouterVoiture(
  new Voiture("AB-123-CD", "Renault", "Clio", "Berline", 90)
);
garage.ajouterVoiture(
  new Voiture("EF-456-GH", "Peugeot", "208", "Hatchback", 75)
);
garage.ajouterVoiture(
  new Voiture("IJ-789-KL", "Citroën", "C3", "Hatchback", 82)
);
garage.ajouterVoiture(
  new Voiture("MN-012-OP", "BMW", "Serie 3", "Berline", 184)
);

// DOM elements
const carForm = document.getElementById("carForm");
const carList = document.getElementById("carList");
const searchBtn = document.getElementById("searchBtn");
const showAllBtn = document.getElementById("showAllBtn");
const searchMatricule = document.getElementById("searchMatricule");
const resetBtn = document.getElementById("resetBtn");
const notification = document.getElementById("notification");

// Display cars in the list
function displayCars(cars = garage.ListVoitures) {
  carList.innerHTML = "";

  if (cars.length === 0) {
    carList.innerHTML =
      '<div class="empty-message">No cars found in the garage</div>';
    return;
  }

  cars.forEach((car) => {
    const carItem = document.createElement("div");
    carItem.className = "car-item";
    carItem.innerHTML = `
                    <div class="car-header">
                        <div class="car-title">${car.name} ${car.modele}</div>
                        <div class="car-details">${car.matricule}</div>
                    </div>
                    <div class="car-details">Type: ${car.type} | Horsepower: ${car.nbchev}</div>
                    <div class="car-actions">
                        <button class="btn btn-danger delete-btn" data-matricule="${car.matricule}">Delete</button>
                    </div>
                `;
    carList.appendChild(carItem);
  });

  // Add event listeners to delete buttons
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const matricule = this.getAttribute("data-matricule");
      deleteCar(matricule);
    });
  });
}

// Add a new car
function addCar(event) {
  event.preventDefault();

  const matricule = document.getElementById("matricule").value;
  const name = document.getElementById("name").value;
  const modele = document.getElementById("modele").value;
  const type = document.getElementById("type").value;
  const nbchev = document.getElementById("nbchev").value;

  // Check if car with same license plate already exists
  if (garage.rechercherVoiture(matricule)) {
    showNotification("A car with this license plate already exists!", "error");
    return;
  }

  const newCar = new Voiture(matricule, name, modele, type, nbchev);
  garage.ajouterVoiture(newCar);

  displayCars();
  carForm.reset();
  showNotification("Car added successfully!", "success");
}

// Delete a car
function deleteCar(matricule) {
  if (confirm("Are you sure you want to delete this car?")) {
    if (garage.supprimerVoiture(matricule)) {
      displayCars();
      showNotification("Car deleted successfully!", "success");
    } else {
      showNotification("Error deleting car!", "error");
    }
  }
}

// Search for a car
function searchCar() {
  const matricule = searchMatricule.value.trim();

  if (!matricule) {
    showNotification("Please enter a license plate to search", "error");
    return;
  }

  const car = garage.rechercherVoiture(matricule);

  if (car) {
    displayCars([car]);
    showNotification("Car found!", "success");
  } else {
    displayCars([]);
    showNotification("No car found with this license plate", "error");
  }
}

// Show all cars
function showAllCars() {
  searchMatricule.value = "";
  displayCars();
}

// Show notification
function showNotification(message, type) {
  notification.textContent = message;
  notification.className = `notification ${type}`;
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

// Event listeners
carForm.addEventListener("submit", addCar);
searchBtn.addEventListener("click", searchCar);
showAllBtn.addEventListener("click", showAllCars);
resetBtn.addEventListener("click", () => carForm.reset());

// Initialize the display
displayCars();
