async function test() {
   try {
      const res = await fetch('http://localhost:5002/api/admissions', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
              institution_id: 3,
              applicant_name: "Test Bug",
              gender: "Male",
              class_applied: "10",
              parent_name: "parent",
              parent_phone: "12345",
              email: "testbug@gmail.com",
              address: "123",
              dob: "2010-01-01"
          })
      });
      const data = await res.json();
      console.log(res.status, data);
   } catch(e) {
      console.log("ERROR:", e);
   }
}
test();
