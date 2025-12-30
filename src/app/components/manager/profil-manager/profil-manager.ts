import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf, NgStyle} from "@angular/common";

@Component({
  selector: 'app-profil-manager',
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    NgStyle
  ],
  templateUrl: './profil-manager.html',
  styleUrl: './profil-manager.css',
})
export class ProfilManager implements OnInit{

  activeSection = 'profile';
  unreadNotifications = 3;
  showModal = false;
  modalMessage = '';
  pendingAction: string = '';
  reportForm: FormGroup;
  selectedFileName: string = 'Glisser ou sélectionner un fichier';

  // User data
  user = {
    image: '',
    nom: 'Doe',
    prenom: 'John',
    email: 'john.doe@example.com',
    tel: '0612345678',
    dateNaissance: '1990-01-01',
    cne: 'AB123456'
  };

  // Notifications with Font Awesome icons
  notifications = [
    {
      id: 1,
      title: 'Réservation confirmée',
      message: 'Votre réservation pour la chambre 302 a été confirmée',
      time: 'Il y a 2 heures',
      read: false,
      icon: 'fas fa-check-circle'
    },
    {
      id: 2,
      title: 'Promotion spéciale',
      message: '20% de réduction sur votre prochaine réservation',
      time: 'Hier, 14:30',
      read: true,
      icon: 'fas fa-tag'
    },
    {
      id: 3,
      title: 'Mise à jour du profil',
      message: 'Votre profil a été mis à jour avec succès',
      time: 'Il y a 3 jours',
      read: true,
      icon: 'fas fa-user-check'
    },
    {
      id: 4,
      title: 'Nouveau service disponible',
      message: 'Service de spa maintenant disponible',
      time: 'Il y a 1 semaine',
      read: false,
      icon: 'fas fa-spa'
    }
  ];

  // Settings
  settings = {
    emailNotifications: true,
    smsNotifications: false,
    language: 'fr',
    publicProfile: true
  };

  // Contact
  contactMessage = '';

  // Report
  report = {
    type: 'technical',
    subject: '',
    description: '',
    screenshot: null as File | null
  };

  profileForm: FormGroup;
  imagePreview: string | null = null;
  originalFormData: any;

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      tel: ['', Validators.required],
      dateNaissance: ['', Validators.required],
      cne: ['', Validators.required],
      image: ['']
    });

    this.reportForm = this.fb.group({
      reportFile: [null, Validators.required]  // ajout Validators ila bghiti
    });
  }

  ngOnInit(): void {
    this.loadUserData();
    this.calculateUnreadNotifications();
  }

  loadUserData(): void {
    // Simuler le chargement des données
    this.profileForm.patchValue(this.user);
    this.originalFormData = this.profileForm.value;
  }

  showSection(section: string): void {
    this.activeSection = section;
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.user.image = this.imagePreview;
        this.profileForm.patchValue({ image: file });
      };
      reader.readAsDataURL(file);
    }
  }

  onScreenshotSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.report.screenshot = file;
    }
  }

  updateProfile(): void {
    if (this.profileForm.valid) {
      console.log('Profile updated:', this.profileForm.value);

      // Simuler sauvegarde
      Object.assign(this.user, this.profileForm.value);
      this.originalFormData = this.profileForm.value;

      // Afficher notification
      this.showNotification('Profil mis à jour avec succès!');
    }
  }

  cancelEdit(): void {
    this.profileForm.patchValue(this.originalFormData);
    this.imagePreview = null;
  }

  toggleRead(notification: any): void {
    notification.read = !notification.read;
    this.calculateUnreadNotifications();
  }

  markAllAsRead(): void {
    this.notifications.forEach(notif => notif.read = true);
    this.unreadNotifications = 0;
  }

  calculateUnreadNotifications(): void {
    this.unreadNotifications = this.notifications.filter(n => !n.read).length;
  }

  sendMessage(): void {
    if (this.contactMessage.trim()) {
      console.log('Message envoyé:', this.contactMessage);
      this.contactMessage = '';
      this.showNotification('Message envoyé avec succès!');
    }
  }


  logout(): void {
    this.modalMessage = 'Êtes-vous sûr de vouloir vous déconnecter?';
    this.pendingAction = 'logout';
    this.showModal = true;
  }

  deleteAccount(): void {
    this.modalMessage = 'Êtes-vous sûr de vouloir supprimer votre compte? Cette action est irréversible!';
    this.pendingAction = 'deleteAccount';
    this.showModal = true;
  }

  confirmAction(): void {
    this.showModal = false;

    if (this.pendingAction === 'logout') {
      // Logique de déconnexion
      console.log('Déconnexion...');
      this.showNotification('Déconnexion réussie!');
    } else if (this.pendingAction === 'deleteAccount') {
      // Logique de suppression de compte
      console.log('Compte supprimé...');
      this.showNotification('Compte supprimé avec succès!');
    }

    this.pendingAction = '';
  }

  showNotification(message: string): void {
    // Simuler une notification
    alert(message);

    // Dans une application réelle, vous utiliseriez un service de notifications
    // this.notificationService.show(message);
  }


  createRoomModalOpen = false;

  openCreateRoomModal() {
    this.createRoomModalOpen = true;
  }

  closeCreateRoomModal() {
    this.createRoomModalOpen = false;
  }

  submitCreateRoom(form: any) {
    console.log('Nouvelle chambre créée:', form);
    this.closeCreateRoomModal();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
      this.reportForm.patchValue({ reportFile: file });
    } else {
      this.selectedFileName = 'Glisser ou sélectionner un fichier';
      this.reportForm.patchValue({ reportFile: null });
    }
  }

  submitReport() {
    if (this.reportForm.valid && this.reportForm.value.reportFile) {
      const file = this.reportForm.value.reportFile;
      console.log('Fichier soumis:', file);
      // Ici tu peux faire upload vers backend via HttpClient
    } else {
      console.warn('Aucun fichier choisi');
    }
  }

}
