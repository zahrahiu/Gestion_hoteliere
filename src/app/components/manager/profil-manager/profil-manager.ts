import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import { HttpClientModule } from '@angular/common/http';
import {RoomService} from '../../../services/room.service';
import {UserProfileService} from '../../../services/user-profile.service';

@Component({
  selector: 'app-profil-manager',
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    NgStyle,
    HttpClientModule,
    NgClass
  ],
  templateUrl: './profil-manager.html',
  styleUrl: './profil-manager.css',
})
export class ProfilManager implements OnInit{
  rooms: any[] = [];
  user: any = {};
  selectedRoom: any = null;
  createRoomModalOpen = false;
  isEditMode = false;

  activeSection = 'profile';
  unreadNotifications = 3;
  showModal = false;
  modalMessage = '';
  pendingAction: string = '';
  reportForm: FormGroup;
  selectedFileName: string = 'Glisser ou sélectionner un fichier';

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
    this.loadMyProfile();
    this.loadRooms();
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

  loadRooms() {
    this.roomService.getRooms().subscribe(data => {
      this.rooms = data;
    });
  }

  openCreateRoomModal() {
    this.isEditMode = false;
    this.selectedRoom = {};
    this.imageFile = null;
    this.createRoomModalOpen = true;
  }

  editRoom(room: any) {
    this.isEditMode = true;
    this.selectedRoom = { ...room };
    this.imageFile = null; // reset file
    this.createRoomModalOpen = true;
  }

  closeCreateRoomModal() {
    this.createRoomModalOpen = false;
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.roomService.uploadImage(file).subscribe({
      next: (imageUrl: string) => {
        this.selectedRoom.image = imageUrl.replace('/uploads/', ''); // نخلي غير filename
        this.imagePreview = imageUrl;

        if (this.selectedRoom.id) {
          const index = this.rooms.findIndex(r => r.id === this.selectedRoom.id);
          if (index > -1) {
            this.rooms[index].image = this.selectedRoom.image;
          }
        }
      },
      error: err => console.error(err)
    });
  }


  submitRoom() {
    if (!this.selectedRoom) return;

    // Build the DTO to match backend
    const roomDto = {
      numero: this.selectedRoom.numero,
      type: this.selectedRoom.type,
      prix: Number(this.selectedRoom.prix),
      etat: this.selectedRoom.etat,
      description: this.selectedRoom.description || '',
      taux: Number(this.selectedRoom.taux) || 0,
      image: this.selectedRoom.image || '',
      lit_long: Number(this.selectedRoom.lit_long) || 0,
      lit_large: Number(this.selectedRoom.lit_large) || 0
    };

    if (this.isEditMode) {
      this.roomService.updateRoom(this.selectedRoom.id, roomDto).subscribe({
        next: () => {
          this.loadRooms();
          this.closeCreateRoomModal();
          alert('Chambre modifiée avec succès!');
        },
        error: (err) => {
          console.error('Erreur update room', err);
          alert('Erreur lors de la modification de la chambre.');
        }
      });
    } else {
      this.roomService.createRoom(roomDto).subscribe({
        next: () => {
          this.loadRooms();
          this.closeCreateRoomModal();
          alert('Chambre créée avec succès!');
        },
        error: (err) => {
          console.error('Erreur create room', err);
          alert('Erreur lors de la création de la chambre.');
        }
      });
    }
  }


  deleteRoom(id: number) {
    if (confirm('Voulez-vous supprimer cette chambre ?')) {
      this.roomService.deleteRoom(id).subscribe(() => {
        this.loadRooms();
        alert('Chambre supprimée avec succès!');
      });
    }
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

}