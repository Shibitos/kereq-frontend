import {TestBed} from '@angular/core/testing';

import {FindFriendsService} from './find-friends.service';

describe('FindFriendsService', () => {
  let service: FindFriendsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FindFriendsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
