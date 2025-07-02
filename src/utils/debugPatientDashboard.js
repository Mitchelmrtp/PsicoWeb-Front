// Agregar esto en el console del navegador para depurar

window.debugPatientDashboard = async function() {
  console.log('🔍 Debugging Patient Dashboard...');
  
  // Check authentication
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  console.log('🔐 Auth Status:', {
    hasToken: !!token,
    tokenPreview: token ? token.substring(0, 20) + '...' : null,
    user: user
  });
  
  if (!token) {
    console.error('❌ No token found');
    return;
  }
  
  // Test API endpoint directly
  const today = new Date().toISOString().split('T')[0];
  const url = `http://localhost:3005/api/sesiones?startDate=${today}&estado=programada`;
  
  console.log('📡 Testing API call:', url);
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('📡 Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Response:', data);
      console.log(`Found ${data.length} appointments`);
      
      // Process each appointment
      data.forEach((appointment, index) => {
        console.log(`📅 Appointment ${index + 1}:`, {
          id: appointment.id,
          fecha: appointment.fecha,
          horaInicio: appointment.horaInicio,
          horaFin: appointment.horaFin,
          estado: appointment.estado,
          psicologo: appointment.Psicologo ? {
            id: appointment.Psicologo.id,
            user: appointment.Psicologo.User
          } : null
        });
      });
    } else {
      const errorData = await response.json();
      console.error('❌ API Error:', errorData);
    }
  } catch (error) {
    console.error('❌ Request failed:', error);
  }
};

console.log('🛠️ Debug function loaded. Run window.debugPatientDashboard() to test');
