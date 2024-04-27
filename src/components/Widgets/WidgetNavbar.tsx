import UINavLink from '../UI/UINavLink';

const NavBar: React.FC = () => {
  return (
    <nav className='bg-gray-800 text-white p-4 rounded-lg  m-2'>
      <ul className='flex gap-10 items-center justify-center'>
        <li >
          <UINavLink path='/' text='Accueil' />
        </li>
        <li>
          <UINavLink path='/play' text='Jouer' />
        </li>

        <li>
          <UINavLink path='/faq' text='FAQ' />
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
