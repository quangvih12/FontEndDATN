<template>
    <div>
      <Form ref="form" @submit="submitForm" :validation-schema="schema" v-slot="{ errors }">
        <div>
          <label for="age">Tuổi:</label>
            <Field name="age" type="number" id="age" class="form-control mt-3"  :class="{ 'p-invalid':  errors.age }"/>
          <small class="p-error">{{ errors.age }}</small>
        </div>
  
        <div>
          <button type="submit" class="btn btn-secondary mt-3">Gửi</button>
        </div>
      </Form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { Form, Field } from 'vee-validate';
  import * as Yup from 'yup';
  
  const ageValue = ref('');
  
   const submitForm = ()=> {
         console.log('heeeee');
   };
  const schema = Yup.object().shape({
    age: Yup.string().required('tuoi ko de trong')
  });
  
  const ageRules = 'required|yup';
  </script>
  