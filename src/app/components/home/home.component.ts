import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService, UserData} from '../../services/auth.service';
import {Subscribable, Subscription} from 'rxjs';
import {PostService} from '../../services/post.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  images: any[] = [
    'https://images-na.ssl-images-amazon.com/images/I/51DR2KzeGBL._AC_.jpg',
    'https://cdn.pixabay.com/photo/2017/08/30/01/05/milky-way-2695569_960_720.jpg',
    'https://torange.biz/photofx/93/8/light-vivid-colors-fragment-love-background-rain-fall-cover-93412.jpg',
    'https://cdn.pixabay.com/photo/2017/07/18/18/24/dove-2516641_960_720.jpg',
    'https://c0.wallpaperflare.com/preview/956/761/225/5be97da101a3f.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/9/9a/Swepac_FB_465%2C_RV70%2C_with_passing_lorry.jpg'
  ];

  posts: any[] = [];
  user: UserData;
  subs: Subscription[] = [];

  constructor(
    private postService: PostService,
    private authService: AuthService
  ) { }

  // @ts-ignore
  ngOnInit(): Promise<void> {
    this.subs.push(this.postService.getAllPosts().subscribe(async (posts) => {
      this.posts = posts;
      console.log(posts);
    }));
    // 現在のuserを保存してsubscribe
    this.subs.push(this.authService.CurrentUser().subscribe(user => {
      this.user = user;
      console.log(user);
    }));

  }

  // interfaceで全部のsubsをroopして購読解除
  ngOnDestroy(): void {
    this.subs.map(s => s.unsubscribe());
  }

  logout(): void {
    this.authService.Logout();
  }

  postMessage(form: NgForm): void{
    console.log(form.value);
    // htmlの<inout>のname="message"と同じ
    const {message} = form.value;
    this.postService.postMessage(message,
      `${this.user.lastName} ${this.user.firstName} `,
      {
        avatar: this.user.avatar,
        lastName: this.user.lastName,
        firstName: this.user.firstName,
      });
    form.resetForm();
  }



}
