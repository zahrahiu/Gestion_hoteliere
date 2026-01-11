import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserProfileResponse {
  userId: number;
  nom: string;
  prenom: string;
  telephone: string;
  adresse: string;
  cin: string;
  metierRole: string;
  departement: string;
  dateEmbauche: Date;
  superviseurId: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private apiUrl = 'http://localhost:8080/v1/user-profiles';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getAllUserProfiles(): Observable<UserProfileResponse[]> {
    return this.http.get<UserProfileResponse[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  changeProfileStatus(
    userId: number, 
    status: string, 
    adminId: number, 
    rejectionReason?: string
  ): Observable<UserProfileResponse> {
    let params: any = {
      status,
      adminId: adminId.toString()
    };
    
    if (rejectionReason) {
      params.rejectionReason = rejectionReason;
    }
    
    return this.http.put<UserProfileResponse>(
      `${this.apiUrl}/${userId}/status`,
      null,
      { 
        headers: this.getHeaders(),
        params 
      }
    );
  }
}