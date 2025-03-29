document.getElementById('prescriptionUploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    // Create a form data object
    const formData = new FormData();
    formData.append('prescriptionFile', document.getElementById('prescriptionFile').files[0]);
  
    // Send the prescription file to the backend using fetch
    fetch('http://localhost:3000/upload-prescription', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      // Populate medicines dropdown
      const medicineSelect = document.getElementById('suggestedMedicine');
      medicineSelect.innerHTML = ''; // Clear previous data
      data.medicines.forEach(medicine => {
        const option = document.createElement('option');
        option.value = medicine;
        option.textContent = medicine;
        medicineSelect.appendChild(option);
      });
  
      // Populate pharmacies list
      const pharmacyList = document.getElementById('pharmacyList');
      pharmacyList.innerHTML = ''; // Clear previous data
      data.pharmacies.forEach(pharmacy => {
        const pharmacyDiv = document.createElement('div');
        pharmacyDiv.textContent = `${pharmacy.name} - ${pharmacy.location} - Price: ${pharmacy.price}`;
        pharmacyList.appendChild(pharmacyDiv);
      });
  
      // Populate delivery updates
      const deliveryUpdates = document.getElementById('deliveryUpdates');
      deliveryUpdates.innerHTML = ''; // Clear previous data
      data.deliveryStatus.forEach(status => {
        const li = document.createElement('li');
        li.textContent = status;
        deliveryUpdates.appendChild(li);
      });
  
      alert('Prescription processed successfully!');
    })
    .catch(error => console.error('Error:', error));
  });
  