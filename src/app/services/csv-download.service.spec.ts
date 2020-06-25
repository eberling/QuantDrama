import { TestBed } from '@angular/core/testing';

import { CsvDownloadService } from './csv-download.service';

describe('CsvDownloadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CsvDownloadService = TestBed.get(CsvDownloadService);
    expect(service).toBeTruthy();
  });
});
