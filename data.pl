#!/usr/bin/env perl

use strict;
use warnings;
use Cache::Memcached::Fast;
use JSON;
use CGI;

my $q = new CGI;
my $keyword = "";
foreach my $name ($q->param) {
	if($name eq 'keyword'){
		$keyword = $q->param($name);
	}
}

print "Content-Type: application/json\n\n";
if($keyword eq ''){
	$keyword = shift;	# for Debug
}
print get_json($keyword);

sub get_json
{
	my $keyword = shift;
	my $memd = Cache::Memcached::Fast->new({
		servers => [ { address => 'localhost:11211' }],
		namespace => 'butumori_cafe:',
		utf8 => 1,
	});
	#$memd->flush_all();	#キャッシュ削除 for Debug
	$keyword =~ s/\s//g;
	if($keyword ne ''){
		#print "key: ".$keyword."\n";
		my $json = $memd->get($keyword);
		if(!$json){
			open(FH, "< ./data.txt") or die("file open error: data.txt\n");
			my @items = <FH>;
			close(FH);
			my @arr=();
			foreach my $item (@items){
				chomp($item);
				my @data = split(/\t/, $item);
				if($data[0] =~ /$keyword/ || $data[1] =~ /$keyword/){
					push(@arr, \@data);
				}
			}
			if(scalar(@arr) > 0){
				$json = to_json(\@arr);
				$memd->set($keyword, $json);
			}
		}
		return $json;
	}
	return '';
}
