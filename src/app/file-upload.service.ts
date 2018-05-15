import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DataService } from './data.service';

@Injectable()
export class FileUploadService {
  handleError(e) {
    return e;
  }
  constructor(private http: HttpClient, private dataService: DataService) { }

  postFile(fileToUpload: File): Observable<any> {
    const endpoint = this.dataService.serverPath + '/api/save-file';
    const formData: FormData = new FormData();
    formData.append('userImg', fileToUpload, fileToUpload.name);
    return this.http.post(endpoint, formData, { responseType: 'json' })
      .map(res => res)
      .catch((e) => this.handleError(e));
  }
}
