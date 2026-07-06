<template>
  <div class="user-registration" data-cy="user-registration-screen">
    <example-header
      title="Alta de usuarios"
      subtitle="Complete el formulario para registrar un nuevo usuario en el sistema"
    />

    <vibe-alert
      v-if="errorMessage"
      variant="error"
      title="Error"
      :message="errorMessage"
      dismissible
      @dismiss="errorMessage = ''"
    />

    <vibe-alert
      v-if="submitted"
      variant="success"
      title="Usuario registrado"
      :message="successMessage"
      data-cy="successMessage"
    />

    <vibe-card
      v-if="!submitted"
      title="Datos del usuario"
      subtitle="Los campos marcados con * son obligatorios"
      badge="Nuevo"
      badge-variant="accent"
    >
      <form class="user-registration__form" @submit.prevent="handleSubmit">
        <div class="user-registration__row">
          <vibe-input
            v-model="form.firstName"
            label="Nombre *"
            placeholder="Ej. María"
            data-cy="firstName"
          />
          <vibe-input
            v-model="form.lastName"
            label="Apellido *"
            placeholder="Ej. García"
            data-cy="lastName"
          />
        </div>

        <vibe-input
          v-model="form.email"
          label="Correo electrónico *"
          type="email"
          placeholder="usuario@empresa.com"
          data-cy="email"
        />

        <vibe-input
          v-model="form.username"
          label="Nombre de usuario *"
          placeholder="mgarcia"
          hint="Solo letras, números y guiones bajos"
          data-cy="username"
        />

        <div class="user-registration__field">
          <label for="role" class="user-registration__label">Rol *</label>
          <select
            id="role"
            v-model="form.role"
            class="user-registration__select"
            data-cy="role"
          >
            <option value="">Seleccione un rol</option>
            <option value="admin">Administrador</option>
            <option value="manager">Supervisor</option>
            <option value="operator">Operador</option>
            <option value="viewer">Consulta</option>
          </select>
        </div>

        <div class="user-registration__row">
          <vibe-input
            v-model="form.password"
            label="Contraseña *"
            type="password"
            placeholder="Mínimo 8 caracteres"
            data-cy="password"
          />
          <vibe-input
            v-model="form.confirmPassword"
            label="Confirmar contraseña *"
            type="password"
            placeholder="Repita la contraseña"
            data-cy="confirmPassword"
          />
        </div>

        <label class="user-registration__checkbox">
          <input
            v-model="form.active"
            type="checkbox"
            data-cy="active"
          />
          <span>Activar usuario al registrar</span>
        </label>

        <div class="user-registration__actions">
          <vibe-button
            label="Cancelar"
            variant="ghost"
            native-type="button"
            data-cy="cancel"
            @click="handleCancel"
          />
          <vibe-button
            label="Registrar usuario"
            variant="primary"
            native-type="submit"
            :disabled="submitting"
            data-cy="submit"
          />
        </div>
      </form>
    </vibe-card>
  </div>
</template>

<script>
import ExampleHeader from "../components/ExampleHeader.vue";
import VibeAlert from "../components/VibeAlert.vue";
import VibeButton from "../components/VibeButton.vue";
import VibeCard from "../components/VibeCard.vue";
import VibeInput from "../components/VibeInput.vue";

const EMPTY_FORM = () => ({
  firstName: "",
  lastName: "",
  email: "",
  username: "",
  role: "",
  password: "",
  confirmPassword: "",
  active: true,
});

export default {
  name: "UserRegistrationScreen",
  components: {
    ExampleHeader,
    VibeAlert,
    VibeButton,
    VibeCard,
    VibeInput,
  },
  data() {
    return {
      form: EMPTY_FORM(),
      submitted: false,
      submitting: false,
      errorMessage: "",
      successMessage: "",
    };
  },
  methods: {
    validate() {
      const { firstName, lastName, email, username, role, password, confirmPassword } = this.form;

      if (!firstName.trim() || !lastName.trim()) {
        return "Ingrese nombre y apellido.";
      }
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return "Ingrese un correo electrónico válido.";
      }
      if (!username.trim() || !/^[a-zA-Z0-9_]+$/.test(username)) {
        return "El nombre de usuario solo puede contener letras, números y guiones bajos.";
      }
      if (!role) {
        return "Seleccione un rol para el usuario.";
      }
      if (password.length < 8) {
        return "La contraseña debe tener al menos 8 caracteres.";
      }
      if (password !== confirmPassword) {
        return "Las contraseñas no coinciden.";
      }
      return "";
    },
    handleSubmit() {
      this.errorMessage = this.validate();
      if (this.errorMessage) return;

      this.submitting = true;

      setTimeout(() => {
        this.submitting = false;
        this.submitted = true;
        this.successMessage = `${this.form.firstName} ${this.form.lastName} fue registrado correctamente como ${this.roleLabel(this.form.role)}.`;
      }, 600);
    },
    handleCancel() {
      this.form = EMPTY_FORM();
      this.errorMessage = "";
      this.submitted = false;
      this.successMessage = "";
    },
    roleLabel(role) {
      const labels = {
        admin: "Administrador",
        manager: "Supervisor",
        operator: "Operador",
        viewer: "Consulta",
      };
      return labels[role] || role;
    },
  },
};
</script>

<style scoped>
.user-registration {
  max-width: 640px;
  margin: 0 auto;
  padding: 28px 24px;
  font-family: Inter, system-ui, sans-serif;
}

.user-registration__form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.user-registration__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.user-registration__field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.user-registration__label {
  font-size: 13px;
  font-weight: 600;
  color: #0f264a;
}

.user-registration__select {
  padding: 12px 16px;
  border: none;
  border-radius: 16px;
  font-size: 14px;
  color: #0f264a;
  background: #f4f7fa;
  outline: none;
  transition: box-shadow 0.15s ease, background 0.15s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%234a5f78' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
}

.user-registration__select:focus {
  background-color: #fff;
  box-shadow: 0 0 0 3px rgba(15, 38, 74, 0.12);
}

.user-registration__checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #4a5f78;
  cursor: pointer;
}

.user-registration__checkbox input {
  width: 16px;
  height: 16px;
  accent-color: #0f264a;
}

.user-registration__actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 8px;
}

@media (max-width: 560px) {
  .user-registration__row {
    grid-template-columns: 1fr;
  }

  .user-registration__actions {
    flex-direction: column-reverse;
  }
}
</style>
