import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {RoomService} from '../../services/room.service';
import {UserProfileService} from '../../services/user-profile.service';


@Component({
  selector: 'app-reception-profile',
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    HttpClientModule,
    NgClass
  ],
  templateUrl: './reception-profile.html',
  styleUrl: './reception-profile.css',
})
export class ReceptionProfile implements OnInit{
  rooms: any[] = [];
  user: any = {};
  createRoomModalOpen = false;

  activeSection = 'profile';
  showModal = false;
  modalMessage = '';
  pendingAction: string = '';
  reportForm: FormGroup;

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
  imageFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private roomService: RoomService,
    private userProfileService: UserProfileService
  ) {
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

  ngOnInit() {
    this.testMeEndpoint();
    this.loadMyProfile();
    this.loadRooms()
  }

  loadRooms() {
    this.roomService.getRooms().subscribe(
      (data) => this.rooms = data,
      (err) => console.error('Error fetching rooms', err)
    );
  }
  loadMyProfile() {
    console.log('CALLING /me ...');

    this.userProfileService.getMyProfile().subscribe({
      next: profile => {
        console.log('PROFILE OK', profile);

        this.profileForm.patchValue({
          nom: profile.nom,
          prenom: profile.prenom,
          email: profile.email,
          tel: profile.tel,
          cne: profile.cne,
          dateNaissance: profile.dateNaissance
        });

        console.log('EMAIL IN FORM', this.profileForm.get('email')?.value);

        this.user = profile;
      },
      error: err => {
        console.error('ERROR PROFILE', err);
      }
    });
  }
  testMeEndpoint() {
    this.userProfileService.getMyProfile().subscribe({
      next: res => console.log('ME OK', res),
      error: err => console.error('ME ERROR', err)
    });
  }


  updateProfile(): void {
    if (this.profileForm.valid) {
      // On ne prend que les champs modifiables
      const updateData = {
        nom: this.profileForm.value.nom,
        prenom: this.profileForm.value.prenom,
        email: this.profileForm.value.email,
        tel: this.profileForm.value.tel,
        dateNaissance: this.profileForm.value.dateNaissance,
        cne: this.profileForm.value.cne
      };


      this.userProfileService.updateMyProfile(updateData).subscribe({
        next: updatedProfile => {
          // Mettre à jour l'UI
          this.user = {...this.user, ...updateData};
          this.originalFormData = this.profileForm.value;

          this.showNotification('Profil mis à jour avec succès!');
        },
        error: err => {
          console.error('Erreur lors de la mise à jour du profil', err);
          this.showNotification('Erreur lors de la mise à jour du profil');
        }
      });
    }
  }
  closeCreateRoomModal() {
    this.createRoomModalOpen = false;
  }
  showSection(section: string): void {
    this.activeSection = section;
  }



  onScreenshotSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.report.screenshot = file;
    }
  }

  cancelEdit(): void {
    this.profileForm.patchValue(this.originalFormData);
    this.imagePreview = null;
  }



  //-----------------------------------------------------------------------------------------------------------
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

  //-----------------------------------------------------------------------------------------------------
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

  clientsOpen = false;

  toggleClients() {
    this.clientsOpen = !this.clientsOpen;
  }

  roomsOpen = false;

  toggleRooms() {
    this.roomsOpen = !this.roomsOpen;
  }

}
