import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {BehaviorSubject, Observable} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  defaultAvatar = 'https://iconbu.com/wp-content/uploads/2019/09/02-10.png';
  // tslint:disable-next-line:variable-name
  // @ts-ignore
  private _userData: Observable<firebase.User>;

  private currentUser: UserData;
  // リアルタイム更新のためコンポネントでサブスクライブ（監視）初期値null
  private currentUser$ = new BehaviorSubject<UserData>(null);

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router,
  ) {
    this._userData = afAuth.authState;
    this._userData.subscribe(user => {
      if (user) { // register時にusersコレクションに追加
        this.afs.collection<UserData>('users')
          .doc<UserData>(user.uid)
          .valueChanges()
          .subscribe(currentUser => {
            if (currentUser !== undefined) {
              this.currentUser = currentUser;
              this.currentUser$.next(this.currentUser);
            } else {
              this.currentUser = null;
              this.currentUser$.next(this.currentUser);
            }
          });
      }
    });
  }
  CurrentUser(): Observable<UserData> {
    return this.currentUser$.asObservable();
  }

  // 新しいuserの情報（emailとpassword）をドキュメントに登録
  // 現在のuserを観察対象にする
  SignUp(email: string,
         password: string,
         firstName: string,
         lastName: string,
         avatar): void {
         // avatar = 'https://portal.staralliance.com/cms/aux-pictures/prototype-images/avatar-default.png/@@images/image.png'): void {
    this.afAuth.createUserWithEmailAndPassword(email, password)
      .then(res => {
        if (res) { // コレクションを探して新しいドキュメントを作成
          if (avatar === undefined || avatar === ''){
            avatar = this.defaultAvatar;
          }
          this.afs.collection('users').doc(res.user.uid)
            .set({
              firstName,
              lastName,
              email,
              avatar
            }).then(value => {
            this.afs.collection<UserData>('users')
              .doc<UserData>(res.user.uid)
              .valueChanges()
              .subscribe(user => {
                console.log(user);
                if (user) { // 現在のuesrが観察対象
                  this.currentUser$.next(user);
                }
              });

          }).catch(err => console.log(err));
        }
      })
      .catch(err => console.log(`Something went wrong ${err.message}`));
  }

  // firebaseのuserが観察対象
  // @ts-ignore
  get userData(): Observable<firebase.User> {
    return this._userData;
  }

  SignIn(email: string, password: string): void {
    console.log(email, password);

    this.afAuth.signInWithEmailAndPassword(email, password)
      .then(res => {
        console.log(res);
        this._userData = this.afAuth.authState;

        // 登録されているusersの検索
        this.afs.collection<UserData>('users')
          .doc<UserData>(res.user.uid)
          .valueChanges()
          .subscribe((user) => {
            console.log(user);
            // @ts-ignore
            this.currentUser = user;
            this.currentUser$.next(this.currentUser);
          });


      }).catch(err => console.log(err.message));
  }

  Logout(): void {
    this.afAuth.signOut().then(res => {
      console.log(res);
      this.currentUser = null;
      this.currentUser$.next(this.currentUser);
      this.router.navigateByUrl('/login').then();
    });
  }

  // userIdを受けて検索
  searchUserInDatabase(user_id: string): Observable<UserData> {
    return this.afs.collection<UserData>('users').doc<UserData>(user_id).valueChanges();
  }

}


export interface UserData {
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
  id?: string;
}
